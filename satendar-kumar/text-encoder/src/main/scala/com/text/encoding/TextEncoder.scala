package com.text.encoding

object TextEncoder {

  private val EMPTY_STRING = ""

  def encode(str: String): String = {
    require(str.length > 0, "Text should not be empty")
    val firstChar = validate(str(0))
    val (encodedText, lastChar, count) =
      str
        .substring(1, str.length)
        .foldLeft((EMPTY_STRING, firstChar, 1)) { case ((encoded, lastChar, count), char) =>
          val validateChar = validate(char)
          if (lastChar == validateChar) {
            (encoded, lastChar, count + 1)
          } else {
            (append(encoded, lastChar, count), validateChar, 1)
          }
        }
    append(encodedText, lastChar, count)
  }

  private def validate(char: Char): Char = {
    if (char >= 48 && char <= 57) {
      throw new IllegalArgumentException(s"Invalid character '$char'")
    } else {
      char
    }
  }
  private def append(str: String, char: Char, count: Int): String =
    if (count == 1) str + char else str + char + count


  /*** *********************************######### Other implementations  ######**************************************************/

  // By Recursion
  def encode1(str: String): String = {
    require(str.length > 0, "Text should not be empty")
    def encode(str: String, last: Char, count: Int, acc: String): String = {
      if (str.length > 0) {
        val char = str(0)
        if (char == last) {
          encode(str.substring(1, str.length), char, count + 1, acc)
        } else {
          val newCharFreq = append(acc, last, count)
          encode(str.substring(1, str.length), char, 1, newCharFreq)
        }
      } else {
        append(acc, last, count)
      }
    }

    encode(str.substring(1, str.length), str(0), 1, EMPTY_STRING)
  }

  // Imperative approach
  def encode2(str: String): String = {
    require(str.trim.length > 0, "Text should not be empty")
    var encodedText = EMPTY_STRING
    var lastChar = str(0)
    var count = 1
    (1 to str.length - 1)
      .foreach { i =>
        val char = str(i)
        if (lastChar == char) {
          count += 1
        } else {
          encodedText = append(encodedText, lastChar, count)
          lastChar = char
          count = 1
        }
      }
    append(encodedText, lastChar, count)
  }


}
