# Práctica final: Adivina dónde está

Ejercicio de asignaturas de aplicaciones HTML5. Práctica final. Adivina dónde está.

## Enunciado

La práctica consiste en la creación de una aplicación HTML5 que permita jugar a una variante del juego de las adivinanzas. Se tratará de mostrar al usuario pistas, en forma de fotografías, y que éste tenga que adivinar, marcándolo en un mapa, a que parte del mundo se refieren.

Detalles del enunciado en el programa de la asignatura.

## Datos y peculiaridades

Login del laboratorio: dsison
Login de github: dgsison

Para la realización de esta práctica he hecho uso de distintas tecnologías y APIS, comenzando por HTML5, CSS para dar estilo al diseño, y javascript (jQuery), para poder organizar la página y adaptar el diseño a diferentes tamaños de pantalla (como dispositivos móviles, tablets...) he utilizado bootstrap y su sistema de organización por 12 columnas, de este modo obtengo un página "responsiva". 
Como la aplicación requiere el uso de un mapa, la obtención de coordenadas y operaciones con ellas (cálculo de distancias) he utilizado la API de leaflet como aprendimos en clase para mostrar un mapa de OpenStreetMap, poder hacer click sobre él, mostrar un popup o investigando en su web poder crear objetos coordenadas y calcular sus distancias en metros (distanceTo() ).
Además del mapa necesitamos mostrar imágenes procedentes de flickr, para ello he hecho uso de su API como aprendimos en clase, realizando la petición de imágenes mediante un tag en JSON y mostrándolas de una en una con un cierto intervalo definido por el usuario (dificultad de la aplicación) gracias a la función setInterval.
Para poder obtener las imágenes de flickr debemos darle un tag del lugar que queremos visualizar, esta lo hago mediante los "tipos de juegos" creados en ficheros JSON.
En este caso he creado 3 tipos de juegos (ficheros JSON) donde incluyo como name el nombre del lugar u objeto que quiero visualizar y en coordinates, la localización geográfica en coordenadas donde se encuentra dicha foto. El valor contenido en el campo name será el que se le pase al tags del JSon de la API de flickr.
Con el uso del history API puedo guardar el estado (tipo de juego, puntuación, dificultad y hora) de un juego y poder volver a jugarlo en un futuro. Cuando "guardo" lo que hago es introducirlo como un elemento(con una etiqueta a para poder verlo como linkeable) en un lista ul de mi HTML asignandole un valor según el número de elementos introducidos y aumentar mi contador de juegos jugados. Esto lo hago para tener la cuenta de en que juego actual estoy y cuales son mis juegos pasados o futuros para poder acceder a ellos mediante la orden history.go(xxx).

Comentar que me he preocupado más por intentar dar un funcionamiento correcto de mi práctica (invertir más horas en el javascript) que por darle un diseño visual más sofisticado o menos "espartano" pegándome con el css. Creo que he dejado un diseño simple y claro del funcionamiento del programa, siempre controlando que no se puedan hacer acciones sin sentido como intentar iniciar un nuevo juego sin seleccionar su tipo o nivel de dificultad o similares e informando al usuario de ello.


Link del video: https://www.youtube.com/watch?v=-8VvHZoVYfU&feature=youtu.be

