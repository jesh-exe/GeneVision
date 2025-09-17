package com.genevision.api.service;

import com.genevision.api.dto.DashboardStats;
import com.genevision.api.dto.GeneSearchResult;
import com.genevision.api.entity.GeneExpression;
import com.genevision.api.repository.GeneExpressionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeneExpressionService {

    @Autowired
    private GeneExpressionRepository repository;

    public int saveAll(List<GeneExpression> expressions) {
        return repository.saveAll(expressions).size();
    }

    public List<String> getAllGenes() {
        return repository.findAll()
                .stream()
                .map(GeneExpression::getGene)
                .distinct()
                .toList();
    }

    public List<GeneSearchResult> searchGene(String gene) {
        return repository.findByGeneIgnoreCase(gene)
                .stream()
                .map(e -> new GeneSearchResult(e.getCondition(), e.getExpression()))
                .toList();
    }

    public DashboardStats getDashboardStats() {
        List<GeneExpression> all = repository.findAll();

        Set<String> genes = all.stream().map(GeneExpression::getGene).collect(Collectors.toSet());
        Set<String> conditions = all.stream().map(GeneExpression::getCondition).collect(Collectors.toSet());

        Map<String, Long> geneCount = all.stream()
                .collect(Collectors.groupingBy(GeneExpression::getGene, Collectors.counting()));

        List<DashboardStats .TopGene> topGenes = geneCount.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(5)
                .map(e -> new DashboardStats.TopGene(e.getKey(), e.getValue()))
                .toList();

        return new DashboardStats(genes.size(), conditions.size(), topGenes);
    }
}