package com.spring.erp_ordit.dto.finance;

import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class Voucher {
	private int v_id;
	private String v_number;
	private String v_classification;
	private int v_amount;
	private String v_customer;
	private String v_description;
}
