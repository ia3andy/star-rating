package org.acme;

import io.quarkus.runtime.util.HashUtil;
import io.vertx.ext.web.RoutingContext;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.hibernate.exception.ConstraintViolationException;
import org.jboss.resteasy.reactive.RestPath;

@Path("/rating")
public class RatingResource {

    @Inject
    RoutingContext context;

    @GET
    @Path("/{ref}")
    @Produces(MediaType.APPLICATION_JSON)
    public Rating.TotalRating rating(@RestPath("ref") String ref) {
        return Rating.totalRating(ref);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Rating.TotalRating rating(NewRating rating) {
        final String userId = HashUtil.sha256(context.request().authority().host());
        if (rating.rating < 0) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Invalid rating!").build());
        }
        if (Rating.hasRated(rating.ref, userId)) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("You already rated!").build());
        }

        Rating r = new Rating(rating.ref, userId, rating.rating);
        r.persist();

        return Rating.totalRating(rating.ref);
    }

    record NewRating(String ref, Integer rating) {
    }
}
