"use strict";

export {
  get
};

async function get( {
  session,
  query: { email },
  database: { auth },
  mail,
  _
}, res ){
  const result = await auth.restorePassword( email );

  if( result !== null && typeof result === "object" && !Array.isArray( result ) && "errors" in result )
    return res.json( result );

  session.isLogged = false;
  session.name = "";
  session.surname = "";
  session.email = "";
  session.userId = 0;
  session.role = "user";

  mail.send(
    email,
    // #fix нормальная тема
    _( "email.confirm_password.subject" ),
    // #fix нормальный текст
    result
  );

  res.success();
}
