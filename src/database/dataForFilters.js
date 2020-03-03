"use strict";

import Foundation from "./helpers/foundation";

export default class extends Foundation{
  constructor( modules ){
    super( modules, "Filters" );
  }

  async get( locale ){
    const transaction = await super.transaction();

    const locations = ( await transaction.query(
      `select id, name
      from locations
      where locale = $1
      order by id`,
      [ locale ]
    ) ).rows;

    const companions = ( await transaction.query(
      `select id, name
      from companions
      where locale = $1
      order by id`,
      [ locale ]
    ) ).rows;

    const subjects = ( await transaction.query(
      `select id, name
      from subjects
      where locale = $1
      order by id`,
      [ locale ]
    ) ).rows;

    const transfers = ( await transaction.query(
      `select id, name
      from transfers
      where locale = $1
      order by id`,
      [ locale ]
    ) ).rows;

    const prices = ( await transaction.query(
      `select
         min( price_min ) as min,
         max( price_max ) as max
       from actions`
    ) ).rows;

    await transaction.end();

    return super.success( 0, { locations, companions, subjects, transfers, prices } );
  }
}
