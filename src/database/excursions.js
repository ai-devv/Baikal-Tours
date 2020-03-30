"use strict";

import Foundation from "./helpers/foundation";

export default class extends Foundation{
  constructor( modules ){
    super( modules, "Excursions" );
  }

  async create( site, date_start, date_end, locationIds, price ){
    const transaction = await super.transaction();

    const id = ( await transaction.query(
      `insert into excursions( site, date_start, date_end, location_ids, price )
      values( $1, $2, $3, $4, $5 )
      returning id`,
      [ site, date_start, date_end, locationIds, price ]
    ) ).rows[0].id;

    return { transaction, id };
  }

  async getAll( locale ){
    const rows = ( await super.query(
      `select e.id, e.image_url, e.price, et.name
      from
        excursions as e,
        excursions_translates as et
      where
        et.locale = $1 and
        e.id = et.excursion_id
      order by date_start`,
      [ locale ]
    ) ).rows;

    return super.success( 0, rows );
  }

  async filter( locale, dateStart, dateEnd, locationIds ){
    let filters = [];
    const params = [ locale ];
    let i = 2;

    if( typeof dateStart === "string" && dateStart !== "" ){
      filters.push( `e.date_start >= $${i++}` );
      params.push( dateStart );
    }

    if( typeof dateEnd === "string" && dateEnd !== "" ){
      filters.push( `e.date_end <= $${i++}` );
      params.push( dateEnd );
    }

    if( Array.isArray( locationIds ) ){
      filters.push( `$${i++}::int[] && e.location_ids` );
      params.push( locationIds );
    }

    if( filters.length > 0 )
      filters = `${filters.join( " and " )} and`;
    else
      filters = "";

    const rows = ( await super.query(
      `select e.id, e.image_url, e.price, et.name
      from
        excursions as e,
        excursions_translates as et
      where
        et.locale = $1 and
        ${filters}
        e.id = et.excursion_id
      order by date_start`,
      params
    ) ).rows;

    return super.success( 0, rows );
  }
}
