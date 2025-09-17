package com.genevision.api.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardStats {
    private int totalGenes;
    private int totalConditions;
    private List<TopGene> topGenes;

    @Data
    @AllArgsConstructor
    public static class TopGene {
        private String gene;
        private long count;
    }
}