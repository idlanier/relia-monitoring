import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as moment from 'moment';
import { GetRevenueByDateDTO } from './dto/getRevenueByDate.dto';
import { getLast7DaysDate } from './util/getLast7DaysDate.util';
import { getFirstDayOfTheWeek } from './util/getFirstDayOfTheWeek.util';
import { getLastDayOfTheWeek } from './util/getLastDayOfTheWeek.util';

@Injectable()
export class DashboardService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getCurrentYearRevenue() {
    const currentYear = moment().year();

    const rawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE LEFT(doc_date, 4) = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [currentYear],
    );

    const result = {
      revenue: Number(rawData[0].revenue),
      total_order: Number(rawData[0].total_order),
    };

    return result;
  }

  async getCurrentMonthRevenue() {
    const currentYear = moment().year();
    const currentMonth =
      moment().month() >= 9
        ? moment().month() + 1
        : '0' + String(moment().month() + 1);

    const firstDateMonth = String(currentYear) + String(currentMonth) + '01';
    const lastDateMonth = String(currentYear) + String(currentMonth) + '31';

    const rawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [firstDateMonth, lastDateMonth],
    );

    const result = {
      revenue: Number(rawData[0].revenue),
      total_order: Number(rawData[0].total_order),
    };

    return result;
  }

  async getCurrentWeekRevenue() {
    const firstDay = getFirstDayOfTheWeek();
    const seventhDay = getLastDayOfTheWeek();

    const rawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [firstDay, seventhDay],
    );

    const result = {
      revenue: Number(rawData[0].revenue),
      total_order: Number(rawData[0].total_order),
    };

    return result;
  }

  async getCurrentDayRevenue() {
    const currentDate = moment().format('YYYYMMDD');

    const rawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [currentDate],
    );

    const result = {
      revenue: Number(rawData[0].revenue),
      total_order: Number(rawData[0].total_order),
    };

    return result;
  }

  async getLast7DaysRevenue() {
    const { first, second, third, fourth, fifth, sixth, seventh } =
      getLast7DaysDate();

    const firstDayRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [first],
    );

    const secondDayRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [second],
    );

    const thirdDayRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [third],
    );

    const fourthDayRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [fourth],
    );

    const fifthDayRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [fifth],
    );

    const sixthDayRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [sixth],
    );

    const seventhDayRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date = $1 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [seventh],
    );

    const result = {
      firstDay: {
        revenue: Number(firstDayRawData[0].revenue),
        total_order: Number(firstDayRawData[0].total_order),
      },
      secondDay: {
        revenue: Number(secondDayRawData[0].revenue),
        total_order: Number(secondDayRawData[0].total_order),
      },
      thirdDay: {
        revenue: Number(thirdDayRawData[0].revenue),
        total_order: Number(thirdDayRawData[0].total_order),
      },
      fourthDay: {
        revenue: Number(fourthDayRawData[0].revenue),
        total_order: Number(fourthDayRawData[0].total_order),
      },
      fifthDay: {
        revenue: Number(fifthDayRawData[0].revenue),
        total_order: Number(fifthDayRawData[0].total_order),
      },
      sixthDay: {
        revenue: Number(sixthDayRawData[0].revenue),
        total_order: Number(sixthDayRawData[0].total_order),
      },
      seventhDay: {
        revenue: Number(seventhDayRawData[0].revenue),
        total_order: Number(seventhDayRawData[0].total_order),
      },
    };

    return result;
  }

  async getRevenueByDate(getRevenueByDate: GetRevenueByDateDTO) {
    const rawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [getRevenueByDate.start_date, getRevenueByDate.end_date],
    );

    const result = {
      revenue: Number(rawData[0].revenue),
      total_order: Number(rawData[0].total_order),
    };

    return result;
  }

  async getCurrentYearDetailedRevenue() {
    const currentYear = moment().year();

    const januaryFirstDateMonth = String(currentYear) + '01' + '01';
    const januaryLastDateMonth = String(currentYear) + '01' + '31';

    const febuaryFirstDateMonth = String(currentYear) + '02' + '01';
    const febuaryLastDateMonth = String(currentYear) + '02' + '31';

    const marchFirstDateMonth = String(currentYear) + '03' + '01';
    const marchLastDateMonth = String(currentYear) + '03' + '31';

    const aprilFirstDateMonth = String(currentYear) + '04' + '01';
    const aprilLastDateMonth = String(currentYear) + '04' + '31';

    const mayFirstDateMonth = String(currentYear) + '05' + '01';
    const mayLastDateMonth = String(currentYear) + '05' + '31';

    const juneFirstDateMonth = String(currentYear) + '06' + '01';
    const juneLastDateMonth = String(currentYear) + '06' + '31';

    const julyFirstDateMonth = String(currentYear) + '07' + '01';
    const julyLastDateMonth = String(currentYear) + '07' + '31';

    const augustFirstDateMonth = String(currentYear) + '08' + '01';
    const augustLastDateMonth = String(currentYear) + '08' + '31';

    const septemberFirstDateMonth = String(currentYear) + '09' + '01';
    const septemberLastDateMonth = String(currentYear) + '09' + '31';

    const octoberFirstDateMonth = String(currentYear) + '10' + '01';
    const octoberLastDateMonth = String(currentYear) + '10' + '31';

    const novemberFirstDateMonth = String(currentYear) + '11' + '01';
    const novemberLastDateMonth = String(currentYear) + '11' + '31';

    const decemberFirstDateMonth = String(currentYear) + '12' + '01';
    const decemberLastDateMonth = String(currentYear) + '12' + '31';

    const januaryRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [januaryFirstDateMonth, januaryLastDateMonth],
    );

    const febuaryRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [febuaryFirstDateMonth, febuaryLastDateMonth],
    );

    const marchRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [marchFirstDateMonth, marchLastDateMonth],
    );

    const aprilRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [aprilFirstDateMonth, aprilLastDateMonth],
    );

    const mayRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [mayFirstDateMonth, mayLastDateMonth],
    );

    const juneRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [juneFirstDateMonth, juneLastDateMonth],
    );

    const julyRawData = await this.entityManager.query(
      'SELECT SUM(payment_amount) AS revenue, ' +
        'COUNT(*) AS total_order ' +
        'FROM pj.trx_pos_payment A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2',
      [julyFirstDateMonth, julyLastDateMonth],
    );

    const augustRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [augustFirstDateMonth, augustLastDateMonth],
    );

    const septemberRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [septemberFirstDateMonth, septemberLastDateMonth],
    );

    const octoberRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [octoberFirstDateMonth, octoberLastDateMonth],
    );

    const novemberRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [novemberFirstDateMonth, novemberLastDateMonth],
    );

    const decemberRawData = await this.entityManager.query(
      'SELECT SUM(A.item_amount_after_discount) AS revenue, ' +
        'COUNT(DISTINCT B.pos_id) AS total_order ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        'AND A.item_amount_after_discount <> 1 ' +
        'AND A.item_amount_after_discount <> 0 ' +
        'AND A.unit_sell_price <> 1 ' +
        'AND A.unit_sell_price <> 0 ' +
        `AND A.product_id ${this.generateReliaProductId()} `,
      [decemberFirstDateMonth, decemberLastDateMonth],
    );

    const result = [
      {
        month: 'Jan',
        revenue: Number(januaryRawData[0].revenue),
        total_order: Number(januaryRawData[0].total_order),
      },
      {
        month: 'Feb',
        revenue: Number(febuaryRawData[0].revenue),
        total_order: Number(febuaryRawData[0].total_order),
      },
      {
        month: 'Mar',
        revenue: Number(marchRawData[0].revenue),
        total_order: Number(marchRawData[0].total_order),
      },
      {
        month: 'Apr',
        revenue: Number(aprilRawData[0].revenue),
        total_order: Number(aprilRawData[0].total_order),
      },
      {
        month: 'May',
        revenue: Number(mayRawData[0].revenue),
        total_order: Number(mayRawData[0].total_order),
      },
      {
        month: 'Jun',
        revenue: Number(juneRawData[0].revenue),
        total_order: Number(juneRawData[0].total_order),
      },
      {
        month: 'Jul',
        revenue: Number(julyRawData[0].revenue),
        total_order: Number(julyRawData[0].total_order),
      },
      {
        month: 'Aug',
        revenue: Number(augustRawData[0].revenue),
        total_order: Number(augustRawData[0].total_order),
      },
      {
        month: 'Sep',
        revenue: Number(septemberRawData[0].revenue),
        total_order: Number(septemberRawData[0].total_order),
      },
      {
        month: 'Oct',
        revenue: Number(octoberRawData[0].revenue),
        total_order: Number(octoberRawData[0].total_order),
      },
      {
        month: 'Nov',
        revenue: Number(novemberRawData[0].revenue),
        total_order: Number(novemberRawData[0].total_order),
      },
      {
        month: 'Dec',
        revenue: Number(decemberRawData[0].revenue),
        total_order: Number(decemberRawData[0].total_order),
      },
    ];

    return result;
  }

  async getCurrentYearMostSoldProductBySales() {
    const currentYear = moment().year();

    const rawData = await this.entityManager.query(
      'SELECT C.product_name as product_name, ' +
        'D.ctgr_product_name as product_category_name, ' +
        'SUM(A.unit_sell_price) as total_sales ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'JOIN public.m_product C ON A.product_id = C.product_id ' +
        'JOIN m_ctgr_product D ON D.ctgr_product_id = C.ctgr_product_id ' +
        'WHERE LEFT(doc_date, 4) = $1 ' +
        `AND A.product_id ${this.generateReliaProductId()} ` +
        'GROUP BY C.product_id, D.ctgr_product_name ' +
        'ORDER BY sum(A.unit_sell_price) DESC ' +
        'LIMIT 10',
      [currentYear],
    );

    return rawData;
  }

  async getCurrentYearMostSoldProductByQuantity() {
    const currentYear = moment().year();

    const rawData = await this.entityManager.query(
      'SELECT C.product_name as product_name, ' +
        'D.ctgr_product_name as product_category_name, ' +
        'SUM(A.qty) as total_qty ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'JOIN public.m_product C ON A.product_id = C.product_id ' +
        'JOIN m_ctgr_product D ON D.ctgr_product_id = C.ctgr_product_id ' +
        'WHERE LEFT(doc_date, 4) = $1 ' +
        `AND A.product_id ${this.generateReliaProductId()} ` +
        'GROUP BY C.product_id, D.ctgr_product_name ' +
        'ORDER BY sum(A.qty) DESC ' +
        'LIMIT 10',
      [currentYear],
    );

    return rawData;
  }

  async getCurrentMonthMostSoldProductBySales() {
    const currentYear = moment().year();
    const currentMonth =
      moment().month() >= 9
        ? moment().month() + 1
        : '0' + String(moment().month() + 1);

    const firstDateMonth = String(currentYear) + String(currentMonth) + '01';
    const lastDateMonth = String(currentYear) + String(currentMonth) + '31';

    const rawData = await this.entityManager.query(
      'SELECT C.product_name as product_name, ' +
        'D.ctgr_product_name as product_category_name, ' +
        'SUM(A.unit_sell_price) as total_sales ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'JOIN public.m_product C ON A.product_id = C.product_id ' +
        'JOIN m_ctgr_product D ON D.ctgr_product_id = C.ctgr_product_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        `AND A.product_id ${this.generateReliaProductId()} ` +
        'GROUP BY C.product_id, D.ctgr_product_name ' +
        'ORDER BY sum(A.unit_sell_price) DESC ' +
        'LIMIT 10',
      [firstDateMonth, lastDateMonth],
    );

    return rawData;
  }

  async getCurrentMonthMostSoldProductByQuantity() {
    const currentYear = moment().year();
    const currentMonth =
      moment().month() >= 9
        ? moment().month() + 1
        : '0' + String(moment().month() + 1);

    const firstDateMonth = String(currentYear) + String(currentMonth) + '01';
    const lastDateMonth = String(currentYear) + String(currentMonth) + '31';

    const rawData = await this.entityManager.query(
      'SELECT C.product_name as product_name, ' +
        'D.ctgr_product_name as product_category_name, ' +
        'SUM(A.qty) as total_qty ' +
        'FROM pj.trx_pos_item A ' +
        'JOIN pj.trx_pos B ON A.pos_id = B.pos_id ' +
        'JOIN public.m_product C ON A.product_id = C.product_id ' +
        'JOIN m_ctgr_product D ON D.ctgr_product_id = C.ctgr_product_id ' +
        'WHERE doc_date BETWEEN $1 AND $2 ' +
        `AND A.product_id ${this.generateReliaProductId()} ` +
        'GROUP BY C.product_id, D.ctgr_product_name ' +
        'ORDER BY sum(A.qty) DESC ' +
        'LIMIT 10',
      [firstDateMonth, lastDateMonth],
    );

    return rawData;
  }

  async getCurrentDayQueue() {
    const currentDate = moment().format('YYYYMMDD');

    const rawData = await this.entityManager.query(
      'SELECT count(*) as total_queue ' +
        'FROM mstr.m_consultation_queue ' +
        'WHERE doc_date = $1',
      [currentDate],
    );

    const result = {
      total_queue: Number(rawData[0].total_queue),
    };

    return result;
  }

  async getCurrentDayTotalOrderVsTotalPayment() {
    const currentDate = moment().format('YYYYMMDD');

    const orderRawData = await this.entityManager.query(
      'SELECT count(*) as total_order ' +
        'FROM pj.trx_pos ' +
        'WHERE doc_date = $1',
      [currentDate],
    );

    const paymentRawData = await this.entityManager.query(
      'SELECT count(*) as total_payment ' +
        'FROM pj.trx_pos_payment ' +
        'WHERE LEFT(create_datetime, 8) = $1',
      [currentDate],
    );

    const result = {
      total_order: Number(orderRawData[0].total_order),
      total_payment: Number(paymentRawData[0].total_payment),
    };

    return result;
  }

  generateReliaProductId() {
    return 'IN (1678, 1134, 1823, 917, 1907, 1162, 334, 834, 1505, 976, 978, 977, 1202, 994, 993, 995, 1400, 992, 1018, 1019, 1210, 1786, 1023, 835, 335, 874, 1221, 877, 1209, 1145, 893, 1211, 1064, 1723, 1188, 1057, 414, 1097, 896, 895, 1894, 1520, 1871, 1151, 1759, 1142, 1856, 938, 937, 1316, 415, 1125, 1294, 1855, 1129, 1720, 1822, 1820, 1725, 1789, 1772, 1734, 1758, 1757, 910, 1205, 930, 1795, 933, 1490, 1491, 1492, 1493, 1464, 1457, 881, 884, 879, 883, 880, 1234, 1866, 1235, 1233, 882, 1247, 1073, 1551, 1160, 1722, 1072, 1074, 1075, 1076, 1424, 321, 1315, 916, 1123, 920, 417, 1912, 1099, 1007, 419, 1030, 1546, 1154, 1229, 915, 1090, 1248, 1143, 1084, 1153, 1699, 1333, 1329, 421, 1231, 1130, 1261, 1104, 1170, 919, 1061, 1041, 422, 423, 1737, 424, 1541, 1120, 1111, 1101, 1124, 1379, 996, 936, 1767, 1721, 1782, 1062, 1003, 921, 997, 922, 1128, 1169, 1140, 1733, 1108, 1220, 1677, 1544, 1693, 1719, 1718, 1710, 1262, 1241, 1735, 1252, 1762, 828, 1192, 1159, 1328, 1029, 826, 1117, 973, 975, 972, 426, 427, 1764, 1033, 1034, 1079, 1172, 1304, 1300, 1904, 1028, 428, 1080, 929, 1206, 1009, 1020, 366, 429, 1908, 1017, 1011, 1016, 1012, 1729, 1195, 1456, 1700, 1717, 1715, 1588, 1701, 1190, 865, 1724, 1324, 1215, 1158, 430, 1044, 945, 1037, 431, 866, 501, 864, 504, 502, 503, 1257, 505, 1100, 432, 1539, 1684, 1325, 1182, 1183, 1047, 1547, 1535, 1144, 1489, 1601, 1602, 1548, 1557, 1910, 1628, 1629, 1632, 1633, 1636, 1614, 1618, 1619, 1611, 1613, 1569, 888, 887, 886, 1228, 1165, 1193, 1118, 1116, 1176, 1186, 1299, 1536, 1024, 1002, 1396, 1001, 435, 1887, 1150, 1121, 986, 1265, 1058, 1250, 1087, 1069, 1105, 1552, 1553, 1226, 1086, 934, 935, 1320, 1071, 1458, 1481, 1482, 1199, 1620, 1480, 1113, 1066, 1558, 1560, 1561, 1564, 1565, 1065, 1068, 1203, 1070, 1114, 1219, 931, 827, 1319, 1191, 1096, 1059, 1208, 1216, 1244, 1217, 1127, 1085, 1067, 987, 1112, 1092, 1460, 1526, 1103, 1173, 1223, 1197, 1198, 985, 1189, 1109, 768, 1549, 1088, 1135, 1395, 1256, 1095, 1568, 904, 1222, 891, 1373, 769, 250, 1807, 1768, 1714, 1727, 1238, 1741, 1888, 1152, 1139, 1802, 829, 969, 970, 1184, 968, 1185, 1148, 319, 1832, 1412, 1410, 1411, 1419, 1115, 1712, 1713, 1874, 1177, 1230, 1232, 1224, 1174, 903, 1089, 901, 918, 1157, 1461, 1407, 1408, 1439, 1227, 1796, 1455, 1382, 1266, 984, 981, 1107, 1110, 1026, 1194, 1242, 1050, 913, 440, 1331, 1163, 1035, 1081, 1394, 988, 989, 1091, 1240, 1736, 1794, 442, 1043, 1338, 1046, 1180, 1060, 486, 1119, 1098, 1726, 1770, 1214, 1644, 538, 533, 532, 535, 534, 1371, 1132, 539, 1131, 1126, 1370, 1369, 1372, 536, 537, 1149, 531, 1704, 1538, 1809, 1267, 1122, 1264, 1522, 1524, 1525, 1521, 1187, 1738)';
  }
}
