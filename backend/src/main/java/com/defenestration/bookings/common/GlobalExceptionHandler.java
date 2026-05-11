package com.defenestration.bookings.common;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ProblemDetail handleConstraintViolation(ConstraintViolationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Request validation failed.");
        problem.setTitle("Bad Request");
        problem.setProperty("errors", toFieldErrors(ex.getConstraintViolations()));
        return problem;
    }

    private List<Map<String, String>> toFieldErrors(
            java.util.Set<ConstraintViolation<?>> violations) {
        return violations.stream()
                .map(v -> Map.of(
                        "field", extractField(v),
                        "message", v.getMessage()))
                .toList();
    }

    private String extractField(ConstraintViolation<?> v) {
        String path = v.getPropertyPath().toString();
        int lastDot = path.lastIndexOf('.');
        return lastDot < 0 ? path : path.substring(lastDot + 1);
    }
}
