Pasos para que corra

* applications.properties
1. Crear base de datos
2. cambiar puerto
3. cambiar password de BD

spring.datasource.url=jdbc:postgresql://localhost:5433/productos_db
spring.datasource.username=postgres
spring.datasource.password=0racle <= cambiar la contaseña

4. ejecutar aplicación
mvn clean install
mvn spring:run
mvn spring-boot:run

5. navegador
y abrir por html estático la página
http://localhost:9000/api/empleados
El proyecto sí o sí debe tener los 5 puntos del MVC, la vista puede ser con axio o con react, angular, etc.

tarea: replicar lo hecho con productos, pero ahora te creas una tabla con empleados que tenga 5 campos. El backend se crea para empleados y el frontend haría la llamada para empleados.