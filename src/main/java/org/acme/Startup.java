package org.acme;

import io.quarkus.runtime.LaunchMode;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

@ApplicationScoped
public class Startup {
    /**
     * This method is executed at the start of your application
     */
    @Transactional
    public void start(@Observes StartupEvent evt) {
        // in DEV mode we seed some data
        if (LaunchMode.current() == LaunchMode.DEVELOPMENT) {
            new Rating("test", "me", 2).persist();
            new Rating("test", "someone", 3).persist();
            new Rating("test", "someone-else", 5).persist();
        }
    }
}