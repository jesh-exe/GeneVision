package com.genevision.api.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GeneSearchResult {
    private String condition;
    private Double expression;
}