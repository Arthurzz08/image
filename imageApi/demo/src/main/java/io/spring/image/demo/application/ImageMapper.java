package io.spring.image.demo.application;

import io.spring.image.demo.domain.entity.Image;
import io.spring.image.demo.domain.enums.ImageExtension;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ImageMapper {

    public Image mapToImage(MultipartFile file, String name, List<String> tags) throws IOException {
        return Image.builder()
                .name(name)
                // remove espaços ao redor de cada tag e ignora tags vazias
                .tags(tags.stream()
                        .map(String::trim)
                        .filter(tag -> !tag.isEmpty())
                        .collect(Collectors.joining(",")))
                .size(file.getSize())
                .extension(ImageExtension.valueOf(MediaType.valueOf(file.getContentType())))
                .file(file.getBytes())
                .build();
    }

    public ImageDTO imageToDTO(Image image, String url) {
        return ImageDTO.builder()
                .id(image.getId())
                .url(url)
                .extension(image.getExtension().name())
                .name(image.getName())
                .size(image.getSize())
                .tags(image.getTags())
                .favorite(Boolean.TRUE.equals(image.getFavorite()))
                .uploadDate(image.getUploadDate().toLocalDate())
                .build();
    }
}