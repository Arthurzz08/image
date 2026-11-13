package io.spring.image.demo.application;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ImageDTO {
    private String id;
    private String url;
    private String name;
    private String extension;
    private Long size;
    private String tags;
    private Boolean favorite;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate uploadDate;
}