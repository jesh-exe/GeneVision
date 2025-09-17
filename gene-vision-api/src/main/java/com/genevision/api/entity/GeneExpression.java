package com.genevision.api.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gene_expression")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneExpression {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gene;
    @Column(name = "expr_condition")
    private String condition;
    private Double expression;
}
