package io.spring.image.demo.application;

import io.spring.image.demo.domain.entity.Image;
import io.spring.image.demo.domain.enums.ImageExtension;
import io.spring.image.demo.domain.service.ImageService;
import io.spring.image.demo.infra.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository repository;

    @Override
    @Transactional
    public Image save(Image image) {
        return repository.save(image);
    }

    @Override
    public Optional<Image> getById(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Image> search(ImageExtension extension, String query) {
        return repository.findByExtensionAndNameOrTagsLike(extension, query);
    }

    @Override
    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public Optional<Image> update(String id, String name, String tags) {
        return repository.findById(id).map(img -> {
            img.setName(name);
            img.setTags(tags);
            return img;
        });
    }

    @Override
    @Transactional
    public Optional<Image> toggleFavorite(String id) {
        return repository.findById(id).map(img -> {
            img.setFavorite(!Boolean.TRUE.equals(img.getFavorite()));
            return img;
        });
    }
}