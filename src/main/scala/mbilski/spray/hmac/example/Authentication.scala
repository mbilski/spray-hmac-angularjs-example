package mbilski.spray.hmac.example

import mbilski.spray.hmac.{Authentication, SignerConfig, DefaultSigner}

case class Account(email: String, secret: String)

case class Auth(a: Option[Account], s: Option[String]) extends Authentication[Account] with DefaultSigner with SignerConfig {
  def accountAndSecret(uuid: String): (Option[Account], Option[String]) = (a, s)
}

