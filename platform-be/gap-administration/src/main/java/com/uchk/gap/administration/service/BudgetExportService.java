package com.uchk.gap.administration.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.uchk.gap.administration.dto.BudgetDto;
import com.uchk.gap.common.BusinessException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class BudgetExportService {

    public byte[] exportPdf(BudgetDto budget) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            document.add(new Paragraph("Budget " + budget.annee() + " — " + budget.type(), titleFont));
            document.add(new Paragraph("Université Cheikh Hamidou Kane", normalFont));
            if (budget.noteOrientation() != null && !budget.noteOrientation().isBlank()) {
                document.add(new Paragraph("Note : " + budget.noteOrientation(), normalFont));
            }
            document.add(new Paragraph(" "));
            addStatLine(document, normalFont, "Total prévu", format(budget.totalPrevu()));
            addStatLine(document, normalFont, "Total réalisé", format(budget.totalRealise()));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.addCell(cell("Intitulé", headerFont));
            table.addCell(cell("Prévu", headerFont));
            table.addCell(cell("Réalisé", headerFont));
            budget.lignes().forEach(l -> {
                table.addCell(cell(l.intitule(), normalFont));
                table.addCell(cell(format(l.montantPrevu()), normalFont));
                table.addCell(cell(format(l.montantRealise()), normalFont));
            });
            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Export PDF budget impossible");
        }
    }

    public byte[] exportExcel(BudgetDto budget) {
        try (Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Budget " + budget.annee());
            int rowIdx = 0;
            Row title = sheet.createRow(rowIdx++);
            title.createCell(0).setCellValue("Budget " + budget.annee() + " — " + budget.type());
            if (budget.noteOrientation() != null) {
                Row note = sheet.createRow(rowIdx++);
                note.createCell(0).setCellValue("Note : " + budget.noteOrientation());
            }
            Row totals = sheet.createRow(rowIdx++);
            totals.createCell(0).setCellValue("Total prévu");
            totals.createCell(1).setCellValue(toDouble(budget.totalPrevu()));
            Row totals2 = sheet.createRow(rowIdx++);
            totals2.createCell(0).setCellValue("Total réalisé");
            totals2.createCell(1).setCellValue(toDouble(budget.totalRealise()));
            rowIdx++;

            Row header = sheet.createRow(rowIdx++);
            header.createCell(0).setCellValue("Intitulé");
            header.createCell(1).setCellValue("Prévu");
            header.createCell(2).setCellValue("Réalisé");
            for (BudgetDto.LigneDto ligne : budget.lignes()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(ligne.intitule());
                row.createCell(1).setCellValue(toDouble(ligne.montantPrevu()));
                row.createCell(2).setCellValue(toDouble(ligne.montantRealise()));
            }
            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Export Excel budget impossible");
        }
    }

    private void addStatLine(Document document, Font font, String label, String value)
            throws DocumentException {
        document.add(new Paragraph(label + " : " + value, font));
    }

    private PdfPCell cell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text != null ? text : "—", font));
        cell.setPadding(6f);
        return cell;
    }

    private String format(BigDecimal value) {
        return value != null ? value.toPlainString() : "0";
    }

    private double toDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : 0d;
    }
}
