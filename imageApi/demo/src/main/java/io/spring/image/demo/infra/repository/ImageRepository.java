package io.spring.image.demo.infra.repository;

import io.spring.image.demo.domain.entity.Image;
import io.spring.image.demo.domain.enums.ImageExtension;
import io.spring.image.demo.infra.repository.specs.GenericSpecs;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.util.StringUtils;

import java.util.List;

import static io.spring.image.demo.infra.repository.specs.GenericSpecs.*;
import static io.spring.image.demo.infra.repository.specs.ImageSpecs.*;
import static org.springframework.data.jpa.domain.Specification.*;

public interface ImageRepository extends JpaRepository<Image, String>, JpaSpecificationExecutor<Image> {

    default List<Image> findByExtensionAndNameOrTagsLike(ImageExtension extension, String query){
        Specification<Image> spec = where(conjunction());
        if(extension !=null){
            //AND EXTENSION = 'PNG'
            spec = spec.and(extensionEqual(extension));
        }
        if(StringUtils.hasText(query)){
            //AND (NAME LIKE 'QUERY' OR TAGS LIKE 'QUERY')
            spec = spec.and(anyOf(nameLike(query), tagsLike(query)));
        }
        // mais recentes primeiro
        return findAll(spec, Sort.by(Sort.Direction.DESC, "uploadDate"));
    }
}