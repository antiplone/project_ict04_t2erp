package com.spring.erp_ordit.domain;

import java.sql.Date;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 전표 개념
 * 
 * @author YD.전
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Voucher {

	/**
	 * 발생일자
	 */
	private Date dates;
	
	/**
	 * 명세된 계정
	 */
	private Account account;
	
	/**
	 * 금액
	 */
	private int amount;
	
	/**
	 * 합계
	 */
	private int totals;
	
	/**
	 * 계정을 과목-항목-적요순으로 Mapping해서 가져옵니다.
	 */
	public Map<String, Object> getDetails() {

		Map<String, Object> details = Map.ofEntries(
			Map.entry("dates", this.dates),
			Map.entry("account", this.account),
			Map.entry("amount", this.amount),
			Map.entry("totals", this.totals)
		);

		return details;
	}
}
