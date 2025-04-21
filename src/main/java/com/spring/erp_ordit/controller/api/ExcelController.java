package com.spring.erp_ordit.controller.api;

import java.io.IOException;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.warehouse.LogisStockDTO;
import com.spring.erp_ordit.service.warehouse.LogisStockItemsServiceImpl;

@RestController		// return 타입이 JSON이다.
@RequestMapping("/excel")
@CrossOrigin(origins = "*") 
public class ExcelController {
	
	@Autowired
	private LogisStockItemsServiceImpl logisStockService;

	// ------------- 구매 현황 엑셀 전환
	// --------------------------------------------------------------------------------------
	// 구매 현황 엑셀 전환 Aapache POI API GetMapping =>
	// http://localhost:8081/excel/exportStockStatusExcel
	@GetMapping("/exportStockStatusExcel")
	public void exportStockStatusExcel(
			@RequestParam(required = false) String start_date,
			@RequestParam(required = false) String end_date,
			@RequestParam(required = false) String item_code,
			@RequestParam(required = false) String storage_code,
			HttpServletResponse response) throws IOException {
		
			Integer parsedItemCode = "null".equals(item_code) ? null : Integer.valueOf(item_code);
			Integer parsedsSorageCode = "null".equals(storage_code) ? null : Integer.valueOf(storage_code);
		/*
		 * // "null" 문자열을 실제 null 로 변환 if ("null".equals(item_code)) item_code = null;
		 * if ("null".equals(client_code)) client_code = null; if
		 * ("null".equals(storage_code)) storage_code = null;
		 */
		try {
			// 정상 처리

			List<LogisStockDTO> stockList = logisStockService.getExcelPrint(start_date, end_date, parsedItemCode, parsedsSorageCode);

			Workbook workbook = new XSSFWorkbook();
			Sheet sheet = workbook.createSheet("재고현황");

			String[] headers = { "품목코드", "품목명", "규격", "재고", "안전재고", "입고일", "창고코드", "창고명" };

			CellStyle headerStyle = workbook.createCellStyle();
			Font headerFont = workbook.createFont();
			headerFont.setBold(true);
			headerStyle.setFont(headerFont);
			headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			headerStyle.setAlignment(HorizontalAlignment.CENTER);

			CellStyle numberStyle = workbook.createCellStyle();
			DataFormat format = workbook.createDataFormat();
			numberStyle.setDataFormat(format.getFormat("#,##0"));

			CellStyle dateStyle = workbook.createCellStyle();
			dateStyle.setDataFormat(format.getFormat("yyyy-MM-dd"));

			Row headerRow = sheet.createRow(0);
			for (int i = 0; i < headers.length; i++) {
				Cell cell = headerRow.createCell(i);
				cell.setCellValue(headers[i]);
				cell.setCellStyle(headerStyle);
			}

			int rowNum = 1;
			for (LogisStockDTO dto : stockList) {
				Row row = sheet.createRow(rowNum++);

				row.createCell(0).setCellValue(dto.getItem_code());
				row.createCell(1).setCellValue(dto.getItem_name());
				row.createCell(2).setCellValue(dto.getItem_standard());

				Cell stockCell = row.createCell(3);
				stockCell.setCellValue(dto.getStock_amount());
				stockCell.setCellStyle(numberStyle);

				Cell safeStockCell = row.createCell(4);
				safeStockCell.setCellValue(dto.getSafe_stock());
				safeStockCell.setCellStyle(numberStyle);

				Cell dateCell = row.createCell(5);
				if (dto.getLast_date() != null) {
					dateCell.setCellValue(dto.getLast_date());
					dateCell.setCellStyle(dateStyle);
				}

				row.createCell(6).setCellValue(dto.getStorage_code());
				row.createCell(7).setCellValue(dto.getStorage_name());
			}

			for (int i = 0; i < headers.length; i++) {
				sheet.autoSizeColumn(i);
			}

			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			String filename = URLEncoder.encode("stock_status_" + LocalDate.now(), "UTF-8").replaceAll("\\+", "%20");
			response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + filename + ".xlsx");

			workbook.write(response.getOutputStream());
			response.flushBuffer();  // 추가
			workbook.close();
		} catch (Exception e) {
		    e.printStackTrace();
		    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		    response.getWriter().write("서버 내부 오류가 발생했습니다: " + e.getMessage());
		}
	}

}
