# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.utils import flt

def execute(filters=None):
	# columns, data = [], []
	# return columns, data
	if not filters: filters = {}

	columns = get_columns()
	data = get_employees(filters)

	return columns, data

def get_columns():
	return [
		{
			"label": _("Acc. No."),
			"fieldname": "account_number",
			"fieldtype": "Link",
			"options": "account_number",
			"width": 12
		},
		{
			"label": _("Currency"),
			"fieldname": "currency",
			"fieldtype": "Link",
			"options": "currency",
			"width": 3
		},
		{
			"label": _("Branch Code"),
			"fieldname": "branch_code",
			"fieldtype": "Link",
			"options": "branch_code",
			"width": 4
		},
		{
			"label": _("Transaction Type"),
			"fieldname": "tt",
			"fieldtype": "Link",
			"options": "tt",
			"width": 1
		},
		{
			"label": _("Amount"),
			"fieldname": "amount",
			"fieldtype": "Float",
			"options": "amount",
			"width": 15
		},
		{
			"label": _("Particular"),
			"fieldname": "particular",
			"fieldtype": "Link",
			"options": "particular",
			"width": 30
		}
	]

def get_employees(filters):
	conditions = get_conditions(filters)
	month = filters["month"] if filters.get("month") else "May"
	return frappe.db.sql("""
SELECT `employee`.`bank_ac_no` AS 'account_number', 'INR' AS 'currency', SUBSTR(`bank_ac_no`,1,4) AS 'branch_code', 'C' AS 'tt', `salary_slip`.`net_pay` AS 'amount', 'Salary of %s' AS 'particular' FROM `tabSalary Slip` AS salary_slip LEFT JOIN `tabEmployee` AS employee ON `salary_slip`.`employee` = `employee`.`name` WHERE 1=1 %s""" % (month, conditions), as_list=1)

def get_conditions(filters):
	conditions = ""
	if filters.get("month"):
		month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
			"Dec"].index(filters["month"]) + 1
		conditions += " and month(`salary_slip`.`start_date`) = '%s'" % month

	if filters.get("year"):
		conditions += " and year(`salary_slip`.`start_date`) = %s" % filters["year"]

	if filters.get("company"): conditions += " and `salary_slip`.`company` = '%s'" % \
		filters["company"].replace("'", "\\'")

	return conditions
