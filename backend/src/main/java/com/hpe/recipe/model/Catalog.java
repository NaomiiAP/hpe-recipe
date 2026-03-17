package com.hpe.recipe.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Catalog {

    @JsonProperty("metadata")
    private CatalogMetadata metadata;

    @JsonProperty("recipes")
    private List<Recipe> recipes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CatalogMetadata {
        @JsonProperty("createdAt")
        private String createdAt;

        @JsonProperty("targetEnvironment")
        private String targetEnvironment;
        
        @JsonProperty("catalogVersion")
        private String catalogVersion;
    }
}
