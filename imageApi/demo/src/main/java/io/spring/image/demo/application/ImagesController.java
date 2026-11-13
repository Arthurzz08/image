package io.spring.image.demo.application;

import io.spring.image.demo.domain.entity.Image;
import io.spring.image.demo.domain.service.ImageService;
import io.spring.image.demo.domain.enums.ImageExtension;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/images")
@Slf4j
@RequiredArgsConstructor
@CrossOrigin("*")
public class ImagesController {

    private final ImageService service;
    private final ImageMapper mapper;

    @PostMapping
    public ResponseEntity save(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("tags") List<String> tags
    ) throws IOException {
        Image image = mapper.mapToImage(file, name, tags);
        Image savedImage = service.save(image);
        URI imageUri = buildImageURL(savedImage);

        return ResponseEntity.created(imageUri).build();
    }

    @GetMapping("{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable("id") String id) {
        var possibleImage = service.getById(id);
        if (possibleImage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var image = possibleImage.get();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(image.getExtension().getMediaType());
        headers.setContentLength(image.getSize());
        headers.setContentDispositionFormData("inline; filename=\"" + image.getFileName() + "\"", image.getFileName());

        return new ResponseEntity<>(image.getFile(), headers, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ImageDTO>> search(
            @RequestParam(value = "extension", required = false, defaultValue = "") String extension,
            @RequestParam(value = "query", required = false) String query) {
        // (removido o Thread.sleep(3000L) que atrasava toda busca)
        var result = service.search(ImageExtension.ofName(extension), query);

        var images = result.stream().map(image -> {
            var url = buildImageURL(image);
            return mapper.imageToDTO(image, url.toString());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(images);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        if (service.getById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable("id") String id, @RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return service.update(id, name.trim(), body.get("tags"))
                .map(img -> ResponseEntity.ok().<Void>build())
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("{id}/favorite")
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(@PathVariable("id") String id) {
        return service.toggleFavorite(id)
                .map(img -> ResponseEntity.ok(Map.of("favorite", Boolean.TRUE.equals(img.getFavorite()))))
                .orElse(ResponseEntity.notFound().build());
    }

    private URI buildImageURL(Image image) {
        String imagePath = "/" + image.getId();
        return ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path(imagePath)
                .build().toUri();
    }

}