package mbilski.spray.hmac.example

import akka.actor.{ActorSystem, Props}
import spray.servlet.WebBoot
import akka.actor.Actor
import spray.routing._
import scala.Some
import mbilski.spray.hmac.Directives

class Boot extends WebBoot {
  val system = ActorSystem("example")
  val serviceActor = system.actorOf(Props[ExampleActor])
}

class ExampleActor extends Actor with ExampleService {
  def actorRefFactory = context
  def receive = runRoute(myRoute)
}

trait ExampleService extends HttpService {
  implicit var auth = new Auth(Some(Account("uid", "s")), Some("s"))

  val myRoute =
    path("api") {
      Directives.authenticate[Account] { account =>
        get {
          complete(account.email)
        }
      }
    }
}