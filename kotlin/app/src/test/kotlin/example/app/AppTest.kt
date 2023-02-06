package example.app

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow

class AppTest {
    @Test fun testGetMessage() {
        assertDoesNotThrow {
            main()
        }
    }
}
