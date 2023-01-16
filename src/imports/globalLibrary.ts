
//return the normaliced direction vector from point1 to point2
function directionVectorBetweenTwoPoints(point1: Vector3, point2: Vector3) {
  return Vector3.Normalize(new Vector3(point2.x - point1.x, point2.y - point1.y, point2.z - point1.z));
}

function lerp(start: float, end: float, amt: float) {
  return (1 - amt) * start + amt * end
}

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}

function randomIntFromInterval(min: number, max: number) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function millisToMinutesAndSecondsAndHours(millis: number) {
  var hours = Math.floor(millis / 3600000)
  var minutes = Math.floor((millis % 3600000) / 60000)
  var seconds = ((millis % 60000) / 1000)
  var secondsString = seconds.toFixed(0)
  return (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + secondsString;
}

function millisToMinutesAndHours(millis: number) {
  var hours = Math.floor(millis / 3600000)
  var minutes = Math.floor((millis % 3600000) / 60000)
  return (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes
}

function millisToMinutesAndSeconds(millis: number) {
  var minutes = Math.floor(millis / 60000)
  var seconds = ((millis % 60000) / 1000)
  var secondsString = seconds.toFixed(0)
  return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + secondsString;
}
function millisToMinutesAndSecondsAndMilis(millis: number) {
  var minutes = Math.floor(millis / 60000)
  var seconds = ((millis % 60000) / 1000)
  var secondsString = seconds.toFixed(0)
  return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + secondsString + ":" + (millis % 1000);
}

function millisToMillisAndSeconds(millis: number) {
  var seconds = Math.floor(millis / 1000)
  var secondsString = seconds.toFixed(0)
  return (seconds < 10 ? '0' : '') + secondsString + ":" + (millis % 1000);
}
function millisToSeconds(millis: number) {
  var seconds = Math.floor(millis / 1000)
  var secondsString = seconds.toFixed(0)
  return (seconds < 10 ? '0' : '') + secondsString;
}

function isPromise(obj: any): boolean {
  return (obj != null && typeof obj.then === 'function')
}

function getMeshShapeComponent(entity: IEntity) {
  if (entity.hasComponent(GLTFShape)) {
    return entity.getComponent(GLTFShape)
  }
  else if (entity.hasComponent(BoxShape)) {
    return entity.getComponent(BoxShape)
  }
  else if (entity.hasComponent(PlaneShape)) {
    return entity.getComponent(PlaneShape)
  }
  else if (entity.hasComponent(SphereShape)) {
    return entity.getComponent(SphereShape)
  }
  else if (entity.hasComponent(ConeShape)) {
    return entity.getComponent(ConeShape)
  }
}

function shuffle<T>(array: Array<T>) {
  let currentIndex = array.length, randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getEntityChildren(entity: IEntity, bGetAllRecursive: boolean = false): IEntity[] {

  if (!entity.children) {
    return []
  }

  var children = entityRecordToArray(entity.children)
  if (!children || children.length == 0) {
    return []
  }

  if (!bGetAllRecursive) {
    return children
  }

  for (const key in entity.children) {
    const aux = getEntityChildren(entity.children[key], true)
    children = children.concat(aux)
  }

  return children
}

// Get the world position of an entity
function getWorldPositionByPolygonal(entity: IEntity, position = new Vector3(0, 0, 0)): Vector3 {
  //No transform
  if (!entity || !entity.hasComponent(Transform)) {
    return new Vector3(0, 0, 0)
  }

  let pos = entity.getComponent(Transform).position.clone()

  //Scale relative position by parent scale
  if (entity.getParent() && entity.getParent().hasComponent(Transform)) {
    pos.rotate(entity.getParent().getComponent(Transform).rotation.clone())
    pos.x = pos.x * entity.getParent().getComponent(Transform).scale.x
    pos.y = pos.y * entity.getParent().getComponent(Transform).scale.y
    pos.z = pos.z * entity.getParent().getComponent(Transform).scale.z
  }
  //Update position
  position = new Vector3(position.x + pos.x, position.y + pos.y, position.z + pos.z)
  //No more parents
  if (!entity.getParent() || !entity.getParent().hasComponent(Transform)) {
    return position
  }
  //Get world position of the parent
  return getWorldPositionByPolygonal(entity.getParent(), position)
}

// Get the world scale of an entity
function getWorldScaleByPolygonal(entity: IEntity, scale = Vector3.One()): Vector3 {
  //No transform
  if (!entity || !entity.hasComponent(Transform)) {
    return Vector3.One()
  }

  let scl = entity.getComponent(Transform).scale.clone()
  //Update scale
  scale = new Vector3(scale.x * scl.x, scale.y * scl.y, scale.z * scl.z)

  //No more parents
  if (!entity.getParent() || !entity.getParent().hasComponent(Transform)) {
    return scale
  }
  //Get world position of the parent
  return getWorldScaleByPolygonal(entity.getParent(), scale)
}

function getWorldRotationByPolygonal(entity: IEntity, rotation = new Quaternion()): Quaternion {
  //No transform
  if (!entity || !entity.hasComponent(Transform)) {
    return new Quaternion()
  }

  let rot = entity.getComponent(Transform).rotation.clone()
  //Update rotation
  rotation = rot.multiply(rotation)

  //No more parents
  if (!entity.getParent() || !entity.getParent().hasComponent(Transform)) {
    return rotation
  }
  //Get world position of the parent
  return getWorldRotationByPolygonal(entity.getParent(), rotation)
}

function entityRecordToArray(record: Record<string, IEntity>) {
  var array: IEntity[] = []
  for (const key in record) {
    array.push(record[key])
  }
  return array
}
//Returns the index of first entity found
function indexOfEntity(entities: IEntity[], entity: IEntity): number {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].uuid == entity.uuid) {
      return i
    }
  }
  return -1
}


function console_log(...args: any[]) {
  console.log(...args)
}
function console_warn(...args: any[]) {
  console.warn(...args)
}

/* Generating a random point in a sphere. */
function getRandomPointInSphere() {
  var u = Math.random();
  var x1 = randn_bm();
  var x2 = randn_bm();
  var x3 = randn_bm();

  var mag = Math.sqrt(x1 * x1 + x2 * x2 + x3 * x3);
  x1 /= mag; x2 /= mag; x3 /= mag;

  // Math.cbrt is cube root
  var c = Math.sqrt(u);

  return new Vector3(x1 * c, x2 * c, x3 * c);
}
/* A random number generator normalice. */
function randn_bm() {
  let u = 1 - Math.random(); //Converting [0,1) to (0,1)
  let v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

//Returns a randomize array of numbers from 0 to max shuffled
function randomNumbers(length: number) {
  var numbers = []
  for (let i = 0; i < length; i++) {
    numbers.push(i)
  }
  return shuffle(numbers)
}