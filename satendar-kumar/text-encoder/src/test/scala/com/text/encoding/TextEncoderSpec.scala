package com.text.encoding

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class TextEncoderSpec extends AnyWordSpec with Matchers {


  "Text encoder " should {

    "encode the text" in {
      TextEncoder.encode("aaaabbcccaeeeee") mustBe "a4b2c3ae5"
    }

    "encode the single char" in {
      TextEncoder.encode("a") mustBe "a"
    }


    "throw exception if text have numeric digit " in {
      assertThrows[IllegalArgumentException] {
        TextEncoder.encode("aabb4cccddd")
      }
    }

    "throw exception for empty text" in {
      assertThrows[IllegalArgumentException] {
        TextEncoder.encode("")
      }
    }

    "throw exception if text have only spaces" in {
      assertThrows[IllegalArgumentException] {
        TextEncoder.encode2("  ")
      }
    }

  }


}