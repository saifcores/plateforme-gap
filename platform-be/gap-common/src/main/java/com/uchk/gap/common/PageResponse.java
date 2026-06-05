package com.uchk.gap.common;

import java.util.List;
import org.springframework.data.domain.Page;

public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        String sort) {

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getSort().toString());
    }

    public static <T> PageResponse<T> slice(
            List<T> all, int page, int size, String sort) {
        int total = all.size();
        int totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 0;
        int start = page * size;
        int end = Math.min(start + size, total);
        List<T> content = start >= total ? List.of() : all.subList(start, end);
        return new PageResponse<>(content, page, size, total, totalPages, sort);
    }
}
