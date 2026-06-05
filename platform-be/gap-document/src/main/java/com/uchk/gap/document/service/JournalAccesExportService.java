package com.uchk.gap.document.service;

import com.uchk.gap.document.dto.JournalAccesDocumentDto;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

@Service
public class JournalAccesExportService {

    public byte[] exportExcel(List<JournalAccesDocumentDto> entries) {
        try (Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Journal accès");
            int rowIdx = 0;
            Row header = sheet.createRow(rowIdx++);
            header.createCell(0).setCellValue("Date");
            header.createCell(1).setCellValue("Document");
            header.createCell(2).setCellValue("Utilisateur");
            header.createCell(3).setCellValue("Email");
            header.createCell(4).setCellValue("Action");

            for (JournalAccesDocumentDto e : entries) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(
                        e.accedeLe() != null ? e.accedeLe().toString() : "");
                row.createCell(1).setCellValue(nullSafe(e.documentNom()));
                row.createCell(2).setCellValue(nullSafe(e.utilisateurNom()));
                row.createCell(3).setCellValue(nullSafe(e.utilisateurEmail()));
                row.createCell(4).setCellValue(nullSafe(e.action()));
            }

            for (int c = 0; c < 5; c++) {
                sheet.autoSizeColumn(c);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("Erreur génération Excel", e);
        }
    }

    private String nullSafe(String value) {
        return value != null ? value : "";
    }
}
