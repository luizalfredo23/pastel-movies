package br.com.luizalfredo23.pastelmovies.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.Map;

@Value
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    Instant timestamp;
    int status;
    String message;
    Map<String, String> errors;
}
