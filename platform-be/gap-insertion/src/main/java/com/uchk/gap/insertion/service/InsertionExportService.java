package com.uchk.gap.insertion.service;

import com.uchk.gap.insertion.dto.InsertionDto;
import com.uchk.gap.insertion.dto.InsertionStatsDto;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

@Service
public class InsertionExportService {

    public byte[] exportPdf(InsertionStatsDto stats, List<InsertionDto> insertions) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            document.add(new Paragraph("Statistiques d'insertion professionnelle", titleFont));
            document.add(new Paragraph("Université Cheikh Hamidou Kane", normalFont));
            document.add(new Paragraph(" "));

            addStatLine(document, normalFont, "Total insertions", stats.totalInsertions());
            addStatLine(document, normalFont, "Auto-emploi", stats.autoEmploi());
            addStatLine(document, normalFont, "Emploi salarié", stats.salarie());
            addStatLine(document, normalFont, "Stages", stats.totalStages());
            addStatLine(document, normalFont, "Contacts", stats.totalContacts());
            addStatLine(document, normalFont, "Partenaires", stats.totalPartenaires());
            document.add(new Paragraph(" "));

            if (!stats.parSecteur().isEmpty()) {
                document.add(new Paragraph("Répartition par secteur", headerFont));
                PdfPTable secteurTable = new PdfPTable(2);
                secteurTable.setWidthPercentage(100);
                secteurTable.addCell(cell("Secteur", headerFont));
                secteurTable.addCell(cell("Effectif", headerFont));
                stats.parSecteur().forEach(s -> {
                    secteurTable.addCell(cell(s.secteur(), normalFont));
                    secteurTable.addCell(cell(String.valueOf(s.count()), normalFont));
                });
                document.add(secteurTable);
                document.add(new Paragraph(" "));
            }

            document.add(new Paragraph("Liste des insertions", headerFont));
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.addCell(cell("Étudiant", headerFont));
            table.addCell(cell("Type", headerFont));
            table.addCell(cell("Entreprise", headerFont));
            table.addCell(cell("Poste", headerFont));
            table.addCell(cell("Date", headerFont));
            insertions.forEach(i -> {
                table.addCell(cell(nullSafe(i.etudiantNom()), normalFont));
                table.addCell(cell(nullSafe(i.type()), normalFont));
                table.addCell(cell(nullSafe(i.entreprise()), normalFont));
                table.addCell(cell(nullSafe(i.poste()), normalFont));
                table.addCell(cell(i.dateInsertion() != null ? i.dateInsertion().toString() : "—", normalFont));
            });
            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new IllegalStateException("Erreur génération PDF", e);
        }
    }

    public byte[] exportExcel(InsertionStatsDto stats, List<InsertionDto> insertions) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet statsSheet = workbook.createSheet("Statistiques");
            int rowIdx = 0;
            rowIdx = addExcelRow(statsSheet, rowIdx, "Indicateur", "Valeur");
            rowIdx = addExcelRow(statsSheet, rowIdx, "Total insertions", stats.totalInsertions());
            rowIdx = addExcelRow(statsSheet, rowIdx, "Auto-emploi", stats.autoEmploi());
            rowIdx = addExcelRow(statsSheet, rowIdx, "Emploi salarié", stats.salarie());
            rowIdx = addExcelRow(statsSheet, rowIdx, "Stages", stats.totalStages());
            rowIdx = addExcelRow(statsSheet, rowIdx, "Contacts", stats.totalContacts());
            rowIdx = addExcelRow(statsSheet, rowIdx, "Partenaires", stats.totalPartenaires());

            if (!stats.parSecteur().isEmpty()) {
                rowIdx += 1;
                rowIdx = addExcelRow(statsSheet, rowIdx, "Secteur", "Effectif");
                for (InsertionStatsDto.SecteurStat s : stats.parSecteur()) {
                    rowIdx = addExcelRow(statsSheet, rowIdx, s.secteur(), s.count());
                }
            }

            Sheet listSheet = workbook.createSheet("Insertions");
            int listRow = 0;
            Row header = listSheet.createRow(listRow++);
            header.createCell(0).setCellValue("Étudiant");
            header.createCell(1).setCellValue("Type");
            header.createCell(2).setCellValue("Entreprise");
            header.createCell(3).setCellValue("Poste");
            header.createCell(4).setCellValue("Secteur");
            header.createCell(5).setCellValue("Date");
            for (InsertionDto i : insertions) {
                Row row = listSheet.createRow(listRow++);
                row.createCell(0).setCellValue(nullSafe(i.etudiantNom()));
                row.createCell(1).setCellValue(nullSafe(i.type()));
                row.createCell(2).setCellValue(nullSafe(i.entreprise()));
                row.createCell(3).setCellValue(nullSafe(i.poste()));
                row.createCell(4).setCellValue(nullSafe(i.secteur()));
                row.createCell(5).setCellValue(
                        i.dateInsertion() != null ? i.dateInsertion().toString() : "");
            }
            for (int c = 0; c < 6; c++) {
                listSheet.autoSizeColumn(c);
            }
            statsSheet.autoSizeColumn(0);
            statsSheet.autoSizeColumn(1);

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("Erreur génération Excel", e);
        }
    }

    private void addStatLine(Document document, Font font, String label, long value)
            throws DocumentException {
        document.add(new Paragraph(label + " : " + value, font));
    }

    private PdfPCell cell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(4f);
        return cell;
    }

    private int addExcelRow(Sheet sheet, int rowIdx, String col1, long col2) {
        Row row = sheet.createRow(rowIdx++);
        row.createCell(0).setCellValue(col1);
        row.createCell(1).setCellValue(col2);
        return rowIdx;
    }

    private int addExcelRow(Sheet sheet, int rowIdx, String col1, String col2) {
        Row row = sheet.createRow(rowIdx++);
        row.createCell(0).setCellValue(col1);
        row.createCell(1).setCellValue(col2);
        return rowIdx;
    }

    private String nullSafe(String value) {
        return value != null ? value : "—";
    }
}
