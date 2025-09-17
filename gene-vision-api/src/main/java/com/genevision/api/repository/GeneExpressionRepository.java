package com.genevision.api.repository;

import com.genevision.api.entity.GeneExpression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneExpressionRepository extends JpaRepository<GeneExpression, Long> {
    List<GeneExpression> findByGeneIgnoreCase(String gene);
}