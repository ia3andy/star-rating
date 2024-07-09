package org.acme;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;


@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "ref", "userId" }) })
public class Rating extends PanacheEntity {
    public String ref;
    public LocalDateTime time;

    public String userId;

    public double rating;

    public Rating() {
    }

    public Rating(String ref, String userId, double rating) {
        this.ref = ref;
        this.time = LocalDateTime.now();
        this.userId = userId;
        this.rating = rating;
    }

    public static boolean hasRated(String ref, String userId) {
        return count("ref = ?1 and userId = ?2", ref, userId) > 0;
    }

    public static TotalRating totalRating(String ref) {
        return find("select avg(r.rating), count(*) from Rating r where ref = ?1", ref).project(TotalRating.class).firstResult();
    }

    public record TotalRating(Double rating, Long count){}
}
