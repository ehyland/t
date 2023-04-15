package example.app

import com.squareup.wire.schema.Location
import com.squareup.wire.schema.MessageType
import com.squareup.wire.schema.Schema
import com.squareup.wire.schema.SchemaLoader
import java.io.File
import java.nio.file.FileSystems

fun main() {
    val schema = schema()
    schema.protoFiles[0].types.forEach { type ->
        val message = type as MessageType
        println("message ${message.name} {")
        message.declaredFields.forEach { field ->
            var labels = ""
            if (!field.isRequired && !field.isRepeated) labels += "optional "
            if (field.isRepeated) labels += "repeated "

            println("  ${labels}${field.type} ${field.name} = ${field.tag};")
        }
        println("}")
    }
}

private fun schema(): Schema {
    val schemaLoader = SchemaLoader(FileSystems.getDefault())
    val root = File("app/src/main/proto").absolutePath
    println(root)
    schemaLoader.initRoots(listOf(Location.get(root)))
    return schemaLoader.loadSchema()
}