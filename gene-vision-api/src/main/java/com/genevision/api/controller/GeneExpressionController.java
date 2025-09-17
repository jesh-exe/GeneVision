package com.genevision.api.controller;

import com.genevision.api.dto.DashboardStats;
import com.genevision.api.dto.GeneSearchResult;
import com.genevision.api.dto.UploadResponse;
import com.genevision.api.entity.GeneExpression;
import com.genevision.api.service.GeneExpressionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GeneExpressionController {

    @Autowired
    private GeneExpressionService service;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> upload(@RequestBody List<GeneExpression> data) {
        int records = service.saveAll(data);
        return ResponseEntity.status(201).body(
                new UploadResponse("Gene expression data uploaded successfully", records)
        );
    }

    @GetMapping("/genes")
    public List<String> getAllGenes() {
        return service.getAllGenes();
    }

    @GetMapping("/genes/{geneName}")
    public List<GeneSearchResult> searchGene(@PathVariable String geneName) {
        return service.searchGene(geneName);
    }

    @GetMapping("/dashboard/stats")
    public DashboardStats getDashboardStats() {
        return service.getDashboardStats();
    }
}
