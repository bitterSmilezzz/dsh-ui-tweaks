var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name2, symbol2) => (symbol2 = Symbol[name2]) ? symbol2 : Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name2, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name: name2, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array2, target) => __defNormalProp(target, __knownSymbol("metadata"), array2[3]);
var __runInitializers = (array2, flags, self, value) => {
  for (var i = 0, fns = array2[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array2, flags, name2, decorators, target, extra2) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array2.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array2[j - 1] = []), extraInitializers = array2[j] || (array2[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name2]() {
    return __privateGet(this, extra2);
  }, set [name2](x) {
    return __privateSet(this, extra2, x);
  } }, name2));
  k ? p && k < 4 && __name(extra2, (k > 2 ? "set " : k > 1 ? "get " : "") + name2) : __name(target, name2);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name2, done = {}, array2[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name2 in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra2 : desc.get) : (x) => x[name2];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra2 : desc.set) : (x, y) => x[name2] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra2 : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra2 = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array2, target), desc && __defProp(target, name2, desc), p ? k ^ 4 ? extra2 : desc : target;
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// ../../deepseek-harness/vendor/cosmokit/src/misc.ts
function isNullable(value) {
  return value === null || value === void 0;
}
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
function filterKeys(object2, filter) {
  return Object.fromEntries(Object.entries(object2).filter(([key, value]) => filter(key, value)));
}
function mapValues(object2, transform2) {
  return Object.fromEntries(Object.entries(object2).map(([key, value]) => [key, transform2(value, key)]));
}
function pick(source, keys, forced) {
  if (!keys) return { ...source };
  const result = {};
  for (const key of keys) {
    if (forced || source[key] !== void 0) result[key] = source[key];
  }
  return result;
}

// ../../deepseek-harness/vendor/cosmokit/src/types.ts
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
var Binary;
((Binary2) => {
  Binary2.is = isArrayBufferLike;
  Binary2.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source)) {
      return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    } else {
      return source;
    }
  }
  Binary2.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(source).toString("base64");
    }
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  Binary2.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  Binary2.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Binary2.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
    const hex3 = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0; i < hex3.length; i += 2) {
      buffer.push(parseInt(`${hex3[i]}${hex3[i + 1]}`, 16));
    }
    return Uint8Array.from(buffer).buffer;
  }
  Binary2.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function clone(source, refs = /* @__PURE__ */ new Map()) {
  if (!source || typeof source !== "object") return source;
  if (is("Date", source)) return new Date(source.valueOf());
  if (is("RegExp", source)) return new RegExp(source.source, source.flags);
  if (isArrayBufferLike(source)) return source.slice(0);
  if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const cached2 = refs.get(source);
  if (cached2) return cached2;
  if (Array.isArray(source)) {
    const result2 = [];
    refs.set(source, result2);
    source.forEach((value, index) => {
      result2[index] = Reflect.apply(clone, null, [value, refs]);
    });
    return result2;
  }
  const result = Object.create(Object.getPrototypeOf(source));
  refs.set(source, result);
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
    if ("value" in descriptor) {
      descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
    }
    Reflect.defineProperty(result, key, descriptor);
  }
  return result;
}
function deepEqual(a, b, strict) {
  if (a === b) return true;
  if (!strict && isNullable(a) && isNullable(b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (!a || !b) return false;
  function check2(test, then) {
    return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
  }
  return check2(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check2(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check2(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? check2(isArrayBufferLike, (a2, b2) => {
    if (a2.byteLength !== b2.byteLength) return false;
    const viewA = new Uint8Array(a2);
    const viewB = new Uint8Array(b2);
    for (let i = 0; i < viewA.length; i++) {
      if (viewA[i] !== viewB[i]) return false;
    }
    return true;
  }) ?? Object.keys({ ...a, ...b }).every((key) => deepEqual(a[key], b[key], strict));
}

// ../../deepseek-harness/vendor/cosmokit/src/time.ts
var Time;
((Time2) => {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date6 = /* @__PURE__ */ new Date(), offset) {
    if (typeof date6 === "number") date6 = new Date(date6);
    if (offset === void 0) offset = timezoneOffset;
    return Math.floor((date6.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date6 = new Date(value * Time2.day);
    if (offset === void 0) offset = timezoneOffset;
    return new Date(+date6 + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture) return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  function parseDate(date6) {
    const parsed = parseTime(date6);
    if (parsed) {
      date6 = Date.now() + parsed;
    } else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date6)) {
      date6 = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date6}`;
    } else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date6)) {
      date6 = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date6}`;
    }
    return date6 ? new Date(date6) : /* @__PURE__ */ new Date();
  }
  Time2.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) {
      return Math.round(ms / Time2.day) + "d";
    } else if (abs >= Time2.hour - Time2.minute / 2) {
      return Math.round(ms / Time2.hour) + "h";
    } else if (abs >= Time2.minute - Time2.second / 2) {
      return Math.round(ms / Time2.minute) + "m";
    } else if (abs >= Time2.second) {
      return Math.round(ms / Time2.second) + "s";
    }
    return ms + "ms";
  }
  Time2.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  function template(template2, time3 = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time3.getFullYear().toString()).replace("yy", time3.getFullYear().toString().slice(2)).replace("MM", toDigits(time3.getMonth() + 1)).replace("dd", toDigits(time3.getDate())).replace("hh", toDigits(time3.getHours())).replace("mm", toDigits(time3.getMinutes())).replace("ss", toDigits(time3.getSeconds())).replace("SSS", toDigits(time3.getMilliseconds(), 3));
  }
  Time2.template = template;
})(Time || (Time = {}));

// ../../deepseek-harness/vendor/schemastery/lib/index.mjs
var kSchema = Symbol.for("schemastery");
var kValidationError = Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError = class extends TypeError {
  options;
  name = "ValidationError";
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
    else if (typeof segment === "number") prefix += "[" + segment + "]";
    else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
    if (prefix.startsWith(".")) prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  static is(error51) {
    return !!error51?.[kValidationError];
  }
};
Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
var Schema = function(options) {
  const schema = function(data, options2 = {}) {
    return Schema.resolve(data, schema, options2)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options2) => new Schema(options2));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options2 = refs[key];
      options2.sKey = getRef(options2.sKey);
      options2.inner = getRef(options2.inner);
      options2.list = options2.list && options2.list.map(getRef);
      options2.dict = options2.dict && mapValues(options2.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string") try {
    schema.callback = new Function("return " + schema.callback)();
  } catch {
  }
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", { get() {
  return {
    version: 1,
    vendor: "schemastery",
    validate: (value) => {
      try {
        return { value: Schema.resolve(value, this, {})[0] };
      } catch (error51) {
        if (ValidationError.is(error51)) return { issues: [{
          message: error51.message,
          path: error51.options.path
        }] };
        throw error51;
      }
    }
  };
} });
Schema.ValidationError = ValidationError;
Schema.prototype.toJSON = function toJSON() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = {
    uid: this.uid,
    refs: globalThis.__schemastery_refs__
  };
  globalThis.__schemastery_refs__ = void 0;
  return result;
};
Schema.prototype.set = function set(key, value) {
  this.dict[key] = value;
  return this;
};
Schema.prototype.push = function push(value) {
  this.list.push(value);
  return this;
};
function mergeDesc(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
    else if (typeof value === "string") result[locale] = value;
  }
  return result;
}
function getInner(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
  const schema = Schema(this);
  const desc = mergeDesc(schema.meta.description, messages);
  if (Object.keys(desc).length) schema.meta.description = desc;
  if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
    return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
  });
  if (schema.list) schema.list = schema.list.map((inner, index) => {
    return inner.i18n(mapValues(messages, (data = {}) => {
      if (Array.isArray(getInner(data))) return getInner(data)[index];
      if (Array.isArray(data)) return data[index];
      return extractKeys(data);
    }));
  });
  if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
    if (getInner(data)) return getInner(data);
    return extractKeys(data);
  }));
  if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  return schema;
};
Schema.prototype.extra = function extra(key, value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
};
for (const key of [
  "required",
  "disabled",
  "collapse",
  "hidden",
  "loose"
]) Object.assign(Schema.prototype, { [key](value = true) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
Schema.prototype.deprecated = function deprecated() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "deprecated",
    type: "danger"
  });
  return schema;
};
Schema.prototype.experimental = function experimental() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "experimental",
    type: "warning"
  });
  return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
  const schema = Schema(this);
  const pattern2 = pick(regexp, ["source", "flags"]);
  schema.meta = {
    ...schema.meta,
    pattern: pattern2
  };
  return schema;
};
Schema.prototype.simplify = function simplify(value) {
  if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
  if (isNullable(value)) return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item)) result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value2, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value2) : value2;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list) Object.assign(result, item.simplify(value));
    return result;
  } else if (this.type === "union") for (const schema of this.list) try {
    Schema.resolve(value, schema, {});
    return schema.simplify(value);
  } catch {
  }
  return value;
};
Schema.prototype.toString = function toString(inline) {
  return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra2) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    role,
    extra: extra2
  };
  return schema;
};
for (const key of [
  "default",
  "link",
  "comment",
  "description",
  "max",
  "min",
  "step"
]) Object.assign(Schema.prototype, { [key](value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
var resolvers = {};
Schema.extend = function extend(type, resolve3) {
  resolvers[type] = resolve3;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
  if (!schema) return [data];
  if (options.ignore?.(data, schema)) return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required) throw new ValidationError(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback)) return [data];
    data = clone(fallback);
  }
  const callback = resolvers[schema.type];
  if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error51) {
    if (!schema.meta.loose) throw error51;
    return [schema.meta.default];
  }
};
Schema.from = function from(source) {
  if (isNullable(source)) return Schema.any();
  else if ([
    "string",
    "number",
    "boolean"
  ].includes(typeof source)) return Schema.const(source).required();
  else if (source[kSchema]) return source;
  else if (typeof source === "function") switch (source) {
    case String:
      return Schema.string().required();
    case Number:
      return Schema.number().required();
    case Boolean:
      return Schema.boolean().required();
    case Function:
      return Schema.function().required();
    default:
      return Schema.is(source).required();
  }
  else throw new TypeError(`cannot infer schema from ${source}`);
};
Schema.lazy = function lazy(builder) {
  const toJSON2 = () => {
    if (!schema.inner[kSchema]) {
      schema.inner = schema.builder();
      schema.inner.meta = {
        ...schema.meta,
        ...schema.inner.meta
      };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema({
    type: "lazy",
    builder,
    inner: { toJSON: toJSON2 }
  });
  return schema;
};
Schema.natural = function natural() {
  return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
  return Schema.number().step(0.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
  return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
    const date6 = new Date(value);
    if (isNaN(+date6)) throw new ValidationError(`invalid date "${value}"`, options);
    return date6;
  }, true)]);
};
Schema.regExp = function regExp(flag = "") {
  return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
    try {
      return new RegExp(value, flag);
    } catch (e) {
      throw new ValidationError(e.message, options);
    }
  }, true)]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
  return Schema.union([
    Schema.is(ArrayBuffer),
    Schema.is(SharedArrayBuffer),
    Schema.transform(Schema.any(), (value, options) => {
      if (Binary.isSource(value)) return Binary.fromSource(value);
      throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema.transform(Schema.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema]) {
    schema.inner = schema.builder();
    schema.inner.meta = {
      ...schema.meta,
      ...schema.inner.meta
    };
  }
  return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
  return [data];
});
Schema.extend("never", (data, _, options) => {
  throw new ValidationError(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value)) return [value];
  throw new ValidationError(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta3, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta3;
  if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta: meta3 }, options) => {
  if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
  if (meta3.pattern) {
    const regexp = new RegExp(meta3.pattern.source, meta3.pattern.flags);
    if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange(data.length, meta3, "string length", options);
  return [data];
});
function decimalShift(data, digits) {
  const str = data.toString();
  if (str.includes("e")) return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1) return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer2 = str.slice(0, index);
  if (frac.length <= digits) return +(integer2 + frac.padEnd(digits, "0"));
  return +(integer2 + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta: meta3 }, options) => {
  if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
  checkWithinRange(data, meta3, "number", options);
  const { step } = meta3;
  if (step && !isMultipleOf(data, meta3.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
  return [data];
});
Schema.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean") return [data];
  throw new ValidationError(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta: meta3 }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits) if (data & bits[key]) keys.push(key);
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
      if (key in bits) value |= bits[key];
    }
  } else throw new ValidationError(`expected number or array but got ${data}`, options);
  if (value === meta3.default) return [value];
  return [value, keys];
});
Schema.extend("function", (data, _, options) => {
  if (typeof data === "function") return [data];
  throw new ValidationError(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor) return [data];
    throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor) return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError(`expected ${constructor} but got ${data}`, options);
  }
});
function property(data, key, schema, options) {
  try {
    const [value, adapted] = Schema.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== void 0) data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix) throw e;
    delete data[key];
    return schema.meta.default;
  }
}
Schema.extend("array", (data, { inner, meta: meta3 }, options) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  checkWithinRange(data.length, meta3, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema.resolve(key, sKey, options)[0];
    } catch (error51) {
      if (strict) continue;
      throw error51;
    }
    result[rKey] = property(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey) delete data[key];
  }
  return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property(data, index, inner, options));
  if (strict) return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge(result, data) {
  for (const key in data) {
    if (key in result) continue;
    result[key] = data[key];
  }
}
Schema.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property(data, key, dict[key], options);
    if (!isNullable(value) || key in data) result[key] = value;
  }
  if (!strict) merge(result, data);
  return [result];
});
Schema.extend("union", (data, { list, toString: toString2 }, options, strict) => {
  const messages = [];
  for (const inner of list) try {
    return Schema.resolve(data, inner, options, strict);
  } catch (error51) {
    messages.push(error51);
  }
  throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString: toString2 }, options, strict) => {
  if (!list.length) return [data];
  let result;
  for (const inner of list) {
    const value = Schema.resolve(data, inner, options, true)[0];
    if (isNullable(value)) continue;
    if (isNullable(result)) result = value;
    else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
    else if (typeof value === "object") merge(result ??= {}, value);
    else if (result !== value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
  }
  if (!strict && isPlainObject(data)) merge(result, data);
  return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema.resolve(data, inner, options, true);
  if (preserve) return [callback(result)];
  else return [callback(result), callback(adapted)];
});
var formatters = {};
function defineMethod(name2, keys, format) {
  formatters[name2] = format;
  Object.assign(Schema, { [name2](...args) {
    const schema = new Schema({ type: name2 });
    keys.forEach((key, index) => {
      switch (key) {
        case "sKey":
          schema.sKey = args[index] ?? Schema.string();
          break;
        case "inner":
          schema.inner = Schema.from(args[index]);
          break;
        case "list":
          schema.list = args[index].map(Schema.from);
          break;
        case "dict":
          schema.dict = mapValues(args[index], Schema.from);
          break;
        case "bits":
          schema.bits = {};
          for (const key2 in args[index]) {
            if (typeof args[index][key2] !== "number") continue;
            schema.bits[key2] = args[index][key2];
          }
          break;
        case "callback": {
          const callback = schema.callback = args[index];
          callback["toJSON"] ||= () => callback.toString();
          break;
        }
        case "constructor": {
          const constructor = schema.constructor = args[index];
          if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
          break;
        }
        default:
          schema[key] = args[index];
      }
    });
    if (name2 === "object" || name2 === "dict") schema.meta.default = {};
    else if (name2 === "array" || name2 === "tuple") schema.meta.default = [];
    else if (name2 === "bitset") schema.meta.default = 0;
    return schema;
  } });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function") return constructor.name;
  else return constructor;
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0) return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", [
  "inner",
  "callback",
  "preserve"
], ({ inner }, isInner) => inner.toString(isInner));

// src/runtime.ts
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// src/files.ts
import { opendir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

// src/defaults.ts
var DEFAULT_IGNORE_DIRS = [
  ".git",
  ".hg",
  ".svn",
  ".idea",
  ".vs",
  ".vscode",
  ".fleet",
  ".history",
  ".metadata",
  ".settings",
  "node_modules",
  "bower_components",
  "vendor",
  "Pods",
  ".gradle",
  ".kotlin",
  ".cxx",
  ".externalNativeBuild",
  ".dart_tool",
  ".swiftpm",
  ".build",
  ".cache",
  ".parcel-cache",
  ".turbo",
  ".nx",
  "__pycache__",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
  ".tox",
  ".venv",
  "venv",
  ".next",
  ".nuxt",
  ".output",
  ".svelte-kit",
  ".angular",
  "build",
  "bin",
  "dist",
  "out",
  "target",
  "obj",
  "coverage",
  "DerivedData",
  "xcuserdata",
  "CMakeFiles",
  "cmake-build-debug",
  "cmake-build-release",
  "cmake-build-relwithdebinfo",
  "cmake-build-minsizerel",
  "_deps",
  ".godot",
  "Library",
  "Temp",
  "Logs",
  "Binaries",
  "Intermediate",
  "Saved",
  "DerivedDataCache"
];
var DEFAULT_IGNORE_FILES = [
  "desktop.ini",
  "Thumbs.db",
  ".DS_Store"
];
function normalizeIgnoreFiles(values) {
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const value of values) {
    const rule = normalizeIgnoreRule(value);
    if (rule === void 0) continue;
    const key = ignoreRuleKey(rule);
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(typeof value === "string" && rule.kind === "exact" && !rule.caseSensitive ? rule.pattern : rule);
  }
  return normalized;
}
function normalizeIgnoreRule(value) {
  if (typeof value === "string") {
    const pattern3 = value.trim();
    return pattern3 === "" ? void 0 : { kind: "exact", pattern: pattern3, caseSensitive: false };
  }
  const pattern2 = value.pattern.trim();
  if (pattern2 === "") return void 0;
  const rule = {
    kind: value.kind,
    pattern: pattern2,
    caseSensitive: value.caseSensitive
  };
  if (rule.kind === "regex") {
    try {
      new RegExp(rule.pattern, rule.caseSensitive ? "" : "i");
    } catch (error51) {
      const message = error51 instanceof Error ? error51.message : String(error51);
      throw new Error(`Invalid regular expression "${rule.pattern}": ${message}`);
    }
  }
  return rule;
}
function ignoreRuleKey(value) {
  const rule = normalizeIgnoreRule(value);
  if (rule === void 0) return "";
  const pattern2 = rule.kind === "exact" && !rule.caseSensitive ? rule.pattern.toLowerCase() : rule.pattern;
  return JSON.stringify([rule.kind, pattern2, rule.caseSensitive]);
}
function compileIgnoreRules(values) {
  return normalizeIgnoreFiles(values).map((value) => normalizeIgnoreRule(value));
}
function workspacePathKey(value) {
  const slashed = value.replace(/\\/gu, "/");
  const withoutTrailing = slashed === "/" || /^[a-z]:\/$/iu.test(slashed) ? slashed : slashed.replace(/\/+$/u, "");
  return /^[a-z]:\//iu.test(withoutTrailing) || withoutTrailing.startsWith("//") ? withoutTrailing.toLowerCase() : withoutTrailing;
}
function normalizeWorkspaceIgnoreFiles(entries) {
  const order = [];
  const byWorkspace = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const key = workspacePathKey(entry.workspace);
    if (key === "") continue;
    const current = byWorkspace.get(key);
    if (current === void 0) order.push(key);
    byWorkspace.set(key, {
      workspace: current?.workspace ?? entry.workspace,
      ignoreFiles: normalizeIgnoreFiles([
        ...current?.ignoreFiles ?? [],
        ...entry.ignoreFiles
      ])
    });
  }
  return order.map((key) => byWorkspace.get(key));
}
function workspaceIgnoreFilesFor(entries, workspace) {
  const key = workspacePathKey(workspace);
  const entry = normalizeWorkspaceIgnoreFiles(entries).find((candidate) => workspacePathKey(candidate.workspace) === key);
  return entry?.ignoreFiles ?? [];
}
function effectiveIgnoreFiles(settings, workspace) {
  return normalizeIgnoreFiles([
    ...settings.ignoreFiles,
    ...workspaceIgnoreFilesFor(settings.workspaceIgnoreFiles ?? [], workspace)
  ]);
}

// src/files.ts
function raceAbort(operation, signal) {
  if (signal === void 0) return operation;
  return new Promise((resolve3, reject) => {
    const onAbort = () => {
      operation.catch(() => {
      });
      reject(asError(signal.reason));
    };
    if (signal.aborted) {
      onAbort();
      return;
    }
    signal.addEventListener("abort", onAbort, { once: true });
    operation.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve3(value);
      },
      (reason) => {
        signal.removeEventListener("abort", onAbort);
        reject(asError(reason));
      }
    );
  });
}
function asError(reason) {
  return reason instanceof Error ? reason : new Error(String(reason));
}
function messageOf(error51) {
  return error51 instanceof Error ? error51.message : String(error51);
}
function displayRelative(root, child) {
  return relative(root, child).split(sep).join("/");
}
function closeOrSwallow(handle, signal) {
  const closing = handle.close();
  if (signal?.aborted) {
    closing.catch(() => {
    });
    return Promise.resolve();
  }
  return closing;
}
async function indexWorkspace(root, options, signal) {
  const ignoreDirs = new Set(options.ignoreDirs);
  const ignoreRules = compileIgnoreRules(options.ignoreFiles);
  const compiledRegex = new Map(ignoreRules.filter((rule) => rule.kind === "regex").map((rule) => [rule, new RegExp(rule.pattern, rule.caseSensitive ? "" : "i")]));
  const files = [];
  const queue = [root];
  let queueIndex = 0;
  let truncated = false;
  while (queueIndex < queue.length) {
    signal?.throwIfAborted();
    const dir = queue[queueIndex];
    queueIndex++;
    let handle;
    try {
      handle = await raceAbort(opendir(dir), signal);
    } catch (error51) {
      signal?.throwIfAborted();
      throw new Error(`at-file: cannot list "${dir}": ${messageOf(error51)}`);
    }
    try {
      for (; ; ) {
        const dirent = await raceAbort(handle.read(), signal);
        if (dirent === null) break;
        if (files.length >= options.maxFiles) {
          truncated = true;
          break;
        }
        if (dirent.isSymbolicLink()) continue;
        const child = join(dir, dirent.name);
        if (dirent.isDirectory()) {
          if (ignoreDirs.has(dirent.name)) continue;
          files.push({ path: child, relative: displayRelative(root, child), kind: "dir" });
          queue.push(child);
          continue;
        }
        if (dirent.isFile() && !ignoreRules.some((rule) => {
          if (rule.kind === "exact") {
            return rule.caseSensitive ? dirent.name === rule.pattern : dirent.name.toLowerCase() === rule.pattern.toLowerCase();
          }
          return compiledRegex.get(rule).test(dirent.name);
        })) {
          files.push({ path: child, relative: displayRelative(root, child), kind: "file" });
        }
      }
    } finally {
      await closeOrSwallow(handle, signal);
    }
    if (truncated) break;
  }
  files.sort((a, b) => a.relative < b.relative ? -1 : 1);
  return { files, truncated };
}

// src/runtime.ts
var _search_dec, _updateSettings_dec, _getSettings_dec, _a, _init;
var AtFileRuntime = class extends (_a = TypertRemoteService, _getSettings_dec = [Remote], _updateSettings_dec = [Remote], _search_dec = [Remote], _a) {
  /**
   * Register the service under the `atFile` key (the wire namespace).
   * @param ctx - owning cordis context.
   * @param config - resolved plugin configuration.
   * @param isEnabled - live settings read; false refuses the endpoint.
   */
  constructor(ctx, config2, readSettings, writeSettings) {
    super(ctx, "atFile");
    this.config = config2;
    this.readSettings = readSettings;
    this.writeSettings = writeSettings;
    __runInitializers(_init, 5, this);
  }
  getSettings() {
    return this.readSettings();
  }
  updateSettings(update) {
    return this.writeSettings(update);
  }
  async search(agent, signal) {
    const settings = this.readSettings();
    if (!settings.enabled) {
      throw new Error("at-file is disabled in Settings");
    }
    const cwd = agent.session.header.cwd;
    if (cwd === void 0) {
      throw new Error("at-file: the session has no workspace directory");
    }
    const index = await indexWorkspace(cwd, {
      maxFiles: this.config.maxIndexedFiles,
      ignoreDirs: this.config.ignoreDirs,
      ignoreFiles: effectiveIgnoreFiles(settings, cwd)
    }, signal);
    return index.files;
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "getSettings", _getSettings_dec, AtFileRuntime);
__decorateElement(_init, 1, "updateSettings", _updateSettings_dec, AtFileRuntime);
__decorateElement(_init, 1, "search", _search_dec, AtFileRuntime);
__decoratorMetadata(_init, AtFileRuntime);

/* zod 子集（生成代码，2026-08-19 tree-shake 替换）：zod@4.4.3 具名导入 8 API（string/object/enum/boolean/union/array/discriminatedUnion/literal）经 esbuild --bundle --minify 打包，IIFE 包裹隔离变量；替换原完整内联 zod（529KB）。重建方法见 dsh-plugins/NOTES。 */
var external_exports = (function () {
var Vn=Object.defineProperty;var Wn=(e,r)=>{for(var t in r)Vn(e,t,{get:r[t],enumerable:!0})};var nr;function u(e,r,t){function o(c,a){if(c._zod||Object.defineProperty(c,"_zod",{value:{def:a,constr:s,traits:new Set},enumerable:!1}),c._zod.traits.has(e))return;c._zod.traits.add(e),r(c,a);let p=s.prototype,l=Object.keys(p);for(let h=0;h<l.length;h++){let m=l[h];m in c||(c[m]=p[m].bind(c))}}let n=t?.Parent??Object;class i extends n{}Object.defineProperty(i,"name",{value:e});function s(c){var a;let p=t?.Parent?new i:this;o(p,c),(a=p._zod).deferred??(a.deferred=[]);for(let l of p._zod.deferred)l();return p}return Object.defineProperty(s,"init",{value:o}),Object.defineProperty(s,Symbol.hasInstance,{value:c=>t?.Parent&&c instanceof t.Parent?!0:c?._zod?.traits?.has(e)}),Object.defineProperty(s,"name",{value:e}),s}var T=class extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}},J=class extends Error{constructor(r){super(`Encountered unidirectional transform during encode: ${r}`),this.name="ZodEncodeError"}};(nr=globalThis).__zod_globalConfig??(nr.__zod_globalConfig={});var B=globalThis.__zod_globalConfig;function A(e){return e&&Object.assign(B,e),B}var g={};Wn(g,{BIGINT_FORMAT_RANGES:()=>lr,Class:()=>be,NUMBER_FORMAT_RANGES:()=>pr,aborted:()=>D,allowsEval:()=>ke,assert:()=>Xn,assertEqual:()=>Kn,assertIs:()=>qn,assertNever:()=>Yn,assertNotEqual:()=>Gn,assignProp:()=>R,base64ToUint8Array:()=>dr,base64urlToUint8Array:()=>_s,cached:()=>W,captureStackTrace:()=>ce,cleanEnum:()=>hs,cleanRegex:()=>Q,clone:()=>E,cloneDef:()=>es,createTransparentProxy:()=>is,defineLazy:()=>_,esc:()=>ie,escapeRegex:()=>C,explicitlyAborted:()=>Se,extend:()=>as,finalizeIssue:()=>N,floatSafeRemainder:()=>ir,getElementAtPath:()=>rs,getEnumValues:()=>X,getLengthableOrigin:()=>re,getParsedType:()=>ss,getSizableOrigin:()=>fr,hexToUint8Array:()=>xs,isObject:()=>F,isPlainObject:()=>U,issue:()=>K,joinValues:()=>Hn,jsonStringifyReplacer:()=>V,merge:()=>ls,mergeDefs:()=>j,normalizeParams:()=>d,nullish:()=>H,numKeys:()=>ns,objectClone:()=>Qn,omit:()=>us,optionalKeys:()=>Pe,parsedType:()=>ms,partial:()=>fs,pick:()=>cs,prefixIssues:()=>ee,primitiveTypes:()=>ur,promiseAllObject:()=>ts,propertyKeyTypes:()=>Ze,randomString:()=>os,required:()=>ds,safeExtend:()=>ps,shallowClone:()=>cr,slugify:()=>we,stringifyPrimitive:()=>ar,uint8ArrayToBase64:()=>mr,uint8ArrayToBase64url:()=>gs,uint8ArrayToHex:()=>zs,unwrapMessage:()=>Y});function Kn(e){return e}function Gn(e){return e}function qn(e){}function Yn(e){throw new Error("Unexpected value in exhaustive check")}function Xn(e){}function X(e){let r=Object.values(e).filter(o=>typeof o=="number");return Object.entries(e).filter(([o,n])=>r.indexOf(+o)===-1).map(([o,n])=>n)}function Hn(e,r="|"){return e.map(t=>ar(t)).join(r)}function V(e,r){return typeof r=="bigint"?r.toString():r}function W(e){return{get value(){{let t=e();return Object.defineProperty(this,"value",{value:t}),t}throw new Error("cached value already set")}}}function H(e){return e==null}function Q(e){let r=e.startsWith("^")?1:0,t=e.endsWith("$")?e.length-1:e.length;return e.slice(r,t)}function ir(e,r){let t=e/r,o=Math.round(t),n=Number.EPSILON*Math.max(Math.abs(t),1);return Math.abs(t-o)<n?0:t-o}var sr=Symbol("evaluating");function _(e,r,t){let o;Object.defineProperty(e,r,{get(){if(o!==sr)return o===void 0&&(o=sr,o=t()),o},set(n){Object.defineProperty(e,r,{value:n})},configurable:!0})}function Qn(e){return Object.create(Object.getPrototypeOf(e),Object.getOwnPropertyDescriptors(e))}function R(e,r,t){Object.defineProperty(e,r,{value:t,writable:!0,enumerable:!0,configurable:!0})}function j(...e){let r={};for(let t of e){let o=Object.getOwnPropertyDescriptors(t);Object.assign(r,o)}return Object.defineProperties({},r)}function es(e){return j(e._zod.def)}function rs(e,r){return r?r.reduce((t,o)=>t?.[o],e):e}function ts(e){let r=Object.keys(e),t=r.map(o=>e[o]);return Promise.all(t).then(o=>{let n={};for(let i=0;i<r.length;i++)n[r[i]]=o[i];return n})}function os(e=10){let r="abcdefghijklmnopqrstuvwxyz",t="";for(let o=0;o<e;o++)t+=r[Math.floor(Math.random()*r.length)];return t}function ie(e){return JSON.stringify(e)}function we(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}var ce="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function F(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}var ke=W(()=>{if(B.jitless||typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return!1;try{let e=Function;return new e(""),!0}catch{return!1}});function U(e){if(F(e)===!1)return!1;let r=e.constructor;if(r===void 0||typeof r!="function")return!0;let t=r.prototype;return!(F(t)===!1||Object.prototype.hasOwnProperty.call(t,"isPrototypeOf")===!1)}function cr(e){return U(e)?{...e}:Array.isArray(e)?[...e]:e instanceof Map?new Map(e):e instanceof Set?new Set(e):e}function ns(e){let r=0;for(let t in e)Object.prototype.hasOwnProperty.call(e,t)&&r++;return r}var ss=e=>{let r=typeof e;switch(r){case"undefined":return"undefined";case"string":return"string";case"number":return Number.isNaN(e)?"nan":"number";case"boolean":return"boolean";case"function":return"function";case"bigint":return"bigint";case"symbol":return"symbol";case"object":return Array.isArray(e)?"array":e===null?"null":e.then&&typeof e.then=="function"&&e.catch&&typeof e.catch=="function"?"promise":typeof Map<"u"&&e instanceof Map?"map":typeof Set<"u"&&e instanceof Set?"set":typeof Date<"u"&&e instanceof Date?"date":typeof File<"u"&&e instanceof File?"file":"object";default:throw new Error(`Unknown data type: ${r}`)}},Ze=new Set(["string","number","symbol"]),ur=new Set(["string","number","bigint","boolean","symbol","undefined"]);function C(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(e,r,t){let o=new e._zod.constr(r??e._zod.def);return(!r||t?.parent)&&(o._zod.parent=e),o}function d(e){let r=e;if(!r)return{};if(typeof r=="string")return{error:()=>r};if(r?.message!==void 0){if(r?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");r.error=r.message}return delete r.message,typeof r.error=="string"?{...r,error:()=>r.error}:r}function is(e){let r;return new Proxy({},{get(t,o,n){return r??(r=e()),Reflect.get(r,o,n)},set(t,o,n,i){return r??(r=e()),Reflect.set(r,o,n,i)},has(t,o){return r??(r=e()),Reflect.has(r,o)},deleteProperty(t,o){return r??(r=e()),Reflect.deleteProperty(r,o)},ownKeys(t){return r??(r=e()),Reflect.ownKeys(r)},getOwnPropertyDescriptor(t,o){return r??(r=e()),Reflect.getOwnPropertyDescriptor(r,o)},defineProperty(t,o,n){return r??(r=e()),Reflect.defineProperty(r,o,n)}})}function ar(e){return typeof e=="bigint"?e.toString()+"n":typeof e=="string"?`"${e}"`:`${e}`}function Pe(e){return Object.keys(e).filter(r=>e[r]._zod.optin==="optional"&&e[r]._zod.optout==="optional")}var pr={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]},lr={int64:[BigInt("-9223372036854775808"),BigInt("9223372036854775807")],uint64:[BigInt(0),BigInt("18446744073709551615")]};function cs(e,r){let t=e._zod.def,o=t.checks;if(o&&o.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");let i=j(e._zod.def,{get shape(){let s={};for(let c in r){if(!(c in t.shape))throw new Error(`Unrecognized key: "${c}"`);r[c]&&(s[c]=t.shape[c])}return R(this,"shape",s),s},checks:[]});return E(e,i)}function us(e,r){let t=e._zod.def,o=t.checks;if(o&&o.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");let i=j(e._zod.def,{get shape(){let s={...e._zod.def.shape};for(let c in r){if(!(c in t.shape))throw new Error(`Unrecognized key: "${c}"`);r[c]&&delete s[c]}return R(this,"shape",s),s},checks:[]});return E(e,i)}function as(e,r){if(!U(r))throw new Error("Invalid input to extend: expected a plain object");let t=e._zod.def.checks;if(t&&t.length>0){let i=e._zod.def.shape;for(let s in r)if(Object.getOwnPropertyDescriptor(i,s)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}let n=j(e._zod.def,{get shape(){let i={...e._zod.def.shape,...r};return R(this,"shape",i),i}});return E(e,n)}function ps(e,r){if(!U(r))throw new Error("Invalid input to safeExtend: expected a plain object");let t=j(e._zod.def,{get shape(){let o={...e._zod.def.shape,...r};return R(this,"shape",o),o}});return E(e,t)}function ls(e,r){if(e._zod.def.checks?.length)throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");let t=j(e._zod.def,{get shape(){let o={...e._zod.def.shape,...r._zod.def.shape};return R(this,"shape",o),o},get catchall(){return r._zod.def.catchall},checks:r._zod.def.checks??[]});return E(e,t)}function fs(e,r,t){let n=r._zod.def.checks;if(n&&n.length>0)throw new Error(".partial() cannot be used on object schemas containing refinements");let s=j(r._zod.def,{get shape(){let c=r._zod.def.shape,a={...c};if(t)for(let p in t){if(!(p in c))throw new Error(`Unrecognized key: "${p}"`);t[p]&&(a[p]=e?new e({type:"optional",innerType:c[p]}):c[p])}else for(let p in c)a[p]=e?new e({type:"optional",innerType:c[p]}):c[p];return R(this,"shape",a),a},checks:[]});return E(r,s)}function ds(e,r,t){let o=j(r._zod.def,{get shape(){let n=r._zod.def.shape,i={...n};if(t)for(let s in t){if(!(s in i))throw new Error(`Unrecognized key: "${s}"`);t[s]&&(i[s]=new e({type:"nonoptional",innerType:n[s]}))}else for(let s in n)i[s]=new e({type:"nonoptional",innerType:n[s]});return R(this,"shape",i),i}});return E(r,o)}function D(e,r=0){if(e.aborted===!0)return!0;for(let t=r;t<e.issues.length;t++)if(e.issues[t]?.continue!==!0)return!0;return!1}function Se(e,r=0){if(e.aborted===!0)return!0;for(let t=r;t<e.issues.length;t++)if(e.issues[t]?.continue===!1)return!0;return!1}function ee(e,r){return r.map(t=>{var o;return(o=t).path??(o.path=[]),t.path.unshift(e),t})}function Y(e){return typeof e=="string"?e:e?.message}function N(e,r,t){let o=e.message?e.message:Y(e.inst?._zod.def?.error?.(e))??Y(r?.error?.(e))??Y(t.customError?.(e))??Y(t.localeError?.(e))??"Invalid input",{inst:n,continue:i,input:s,...c}=e;return c.path??(c.path=[]),c.message=o,r?.reportInput&&(c.input=s),c}function fr(e){return e instanceof Set?"set":e instanceof Map?"map":e instanceof File?"file":"unknown"}function re(e){return Array.isArray(e)?"array":typeof e=="string"?"string":"unknown"}function ms(e){let r=typeof e;switch(r){case"number":return Number.isNaN(e)?"nan":"number";case"object":{if(e===null)return"null";if(Array.isArray(e))return"array";let t=e;if(t&&Object.getPrototypeOf(t)!==Object.prototype&&"constructor"in t&&t.constructor)return t.constructor.name}}return r}function K(...e){let[r,t,o]=e;return typeof r=="string"?{message:r,code:"custom",input:t,inst:o}:{...r}}function hs(e){return Object.entries(e).filter(([r,t])=>Number.isNaN(Number.parseInt(r,10))).map(r=>r[1])}function dr(e){let r=atob(e),t=new Uint8Array(r.length);for(let o=0;o<r.length;o++)t[o]=r.charCodeAt(o);return t}function mr(e){let r="";for(let t=0;t<e.length;t++)r+=String.fromCharCode(e[t]);return btoa(r)}function _s(e){let r=e.replace(/-/g,"+").replace(/_/g,"/"),t="=".repeat((4-r.length%4)%4);return dr(r+t)}function gs(e){return mr(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function xs(e){let r=e.replace(/^0x/,"");if(r.length%2!==0)throw new Error("Invalid hex string length");let t=new Uint8Array(r.length/2);for(let o=0;o<r.length;o+=2)t[o/2]=Number.parseInt(r.slice(o,o+2),16);return t}function zs(e){return Array.from(e).map(r=>r.toString(16).padStart(2,"0")).join("")}var be=class{constructor(...r){}};var hr=(e,r)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:!1}),Object.defineProperty(e,"issues",{value:r,enumerable:!1}),e.message=JSON.stringify(r,V,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:!1})},ue=u("$ZodError",hr),Oe=u("$ZodError",hr,{Parent:Error});function _r(e,r=t=>t.message){let t={},o=[];for(let n of e.issues)n.path.length>0?(t[n.path[0]]=t[n.path[0]]||[],t[n.path[0]].push(r(n))):o.push(r(n));return{formErrors:o,fieldErrors:t}}function gr(e,r=t=>t.message){let t={_errors:[]},o=(n,i=[])=>{for(let s of n.issues)if(s.code==="invalid_union"&&s.errors.length)s.errors.map(c=>o({issues:c},[...i,...s.path]));else if(s.code==="invalid_key")o({issues:s.issues},[...i,...s.path]);else if(s.code==="invalid_element")o({issues:s.issues},[...i,...s.path]);else{let c=[...i,...s.path];if(c.length===0)t._errors.push(r(s));else{let a=t,p=0;for(;p<c.length;){let l=c[p];p===c.length-1?(a[l]=a[l]||{_errors:[]},a[l]._errors.push(r(s))):a[l]=a[l]||{_errors:[]},a=a[l],p++}}}};return o(e),t}var ae=e=>(r,t,o,n)=>{let i=o?{...o,async:!1}:{async:!1},s=r._zod.run({value:t,issues:[]},i);if(s instanceof Promise)throw new T;if(s.issues.length){let c=new(n?.Err??e)(s.issues.map(a=>N(a,i,A())));throw ce(c,n?.callee),c}return s.value};var pe=e=>async(r,t,o,n)=>{let i=o?{...o,async:!0}:{async:!0},s=r._zod.run({value:t,issues:[]},i);if(s instanceof Promise&&(s=await s),s.issues.length){let c=new(n?.Err??e)(s.issues.map(a=>N(a,i,A())));throw ce(c,n?.callee),c}return s.value};var te=e=>(r,t,o)=>{let n=o?{...o,async:!1}:{async:!1},i=r._zod.run({value:t,issues:[]},n);if(i instanceof Promise)throw new T;return i.issues.length?{success:!1,error:new(e??ue)(i.issues.map(s=>N(s,n,A())))}:{success:!0,data:i.value}},xr=te(Oe),oe=e=>async(r,t,o)=>{let n=o?{...o,async:!0}:{async:!0},i=r._zod.run({value:t,issues:[]},n);return i instanceof Promise&&(i=await i),i.issues.length?{success:!1,error:new e(i.issues.map(s=>N(s,n,A())))}:{success:!0,data:i.value}},zr=oe(Oe),vr=e=>(r,t,o)=>{let n=o?{...o,direction:"backward"}:{direction:"backward"};return ae(e)(r,t,n)};var yr=e=>(r,t,o)=>ae(e)(r,t,o);var $r=e=>async(r,t,o)=>{let n=o?{...o,direction:"backward"}:{direction:"backward"};return pe(e)(r,t,n)};var br=e=>async(r,t,o)=>pe(e)(r,t,o);var wr=e=>(r,t,o)=>{let n=o?{...o,direction:"backward"}:{direction:"backward"};return te(e)(r,t,n)};var kr=e=>(r,t,o)=>te(e)(r,t,o);var Zr=e=>async(r,t,o)=>{let n=o?{...o,direction:"backward"}:{direction:"backward"};return oe(e)(r,t,n)};var Pr=e=>async(r,t,o)=>oe(e)(r,t,o);var Sr=/^[cC][0-9a-z]{6,}$/,Or=/^[0-9a-z]+$/,Er=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,Ir=/^[0-9a-vA-V]{20}$/,Tr=/^[A-Za-z0-9]{27}$/,Nr=/^[a-zA-Z0-9_-]{21}$/,Ar=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;var jr=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,Ee=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;var Cr=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;var ys="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Rr(){return new RegExp(ys,"u")}var Dr=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Lr=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;var Fr=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Ur=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Mr=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Ie=/^[A-Za-z0-9_-]*$/;var Jr=/^https?$/,Br=/^\+[1-9]\d{6,14}$/,Vr="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",Wr=new RegExp(`^${Vr}$`);function Kr(e){let r="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${r}`:e.precision===0?`${r}:[0-5]\\d`:`${r}:[0-5]\\d\\.\\d{${e.precision}}`:`${r}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Gr(e){return new RegExp(`^${Kr(e)}$`)}function qr(e){let r=Kr({precision:e.precision}),t=["Z"];e.local&&t.push(""),e.offset&&t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");let o=`${r}(?:${t.join("|")})`;return new RegExp(`^${Vr}T(?:${o})$`)}var Yr=e=>{let r=e?`[\\s\\S]{${e?.minimum??0},${e?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${r}$`)};var Xr=/^(?:true|false)$/i;var Hr=/^[^A-Z]*$/,Qr=/^[^a-z]*$/;var S=u("$ZodCheck",(e,r)=>{var t;e._zod??(e._zod={}),e._zod.def=r,(t=e._zod).onattach??(t.onattach=[])});var et=u("$ZodCheckMaxLength",(e,r)=>{var t;S.init(e,r),(t=e._zod.def).when??(t.when=o=>{let n=o.value;return!H(n)&&n.length!==void 0}),e._zod.onattach.push(o=>{let n=o._zod.bag.maximum??Number.POSITIVE_INFINITY;r.maximum<n&&(o._zod.bag.maximum=r.maximum)}),e._zod.check=o=>{let n=o.value;if(n.length<=r.maximum)return;let s=re(n);o.issues.push({origin:s,code:"too_big",maximum:r.maximum,inclusive:!0,input:n,inst:e,continue:!r.abort})}}),rt=u("$ZodCheckMinLength",(e,r)=>{var t;S.init(e,r),(t=e._zod.def).when??(t.when=o=>{let n=o.value;return!H(n)&&n.length!==void 0}),e._zod.onattach.push(o=>{let n=o._zod.bag.minimum??Number.NEGATIVE_INFINITY;r.minimum>n&&(o._zod.bag.minimum=r.minimum)}),e._zod.check=o=>{let n=o.value;if(n.length>=r.minimum)return;let s=re(n);o.issues.push({origin:s,code:"too_small",minimum:r.minimum,inclusive:!0,input:n,inst:e,continue:!r.abort})}}),tt=u("$ZodCheckLengthEquals",(e,r)=>{var t;S.init(e,r),(t=e._zod.def).when??(t.when=o=>{let n=o.value;return!H(n)&&n.length!==void 0}),e._zod.onattach.push(o=>{let n=o._zod.bag;n.minimum=r.length,n.maximum=r.length,n.length=r.length}),e._zod.check=o=>{let n=o.value,i=n.length;if(i===r.length)return;let s=re(n),c=i>r.length;o.issues.push({origin:s,...c?{code:"too_big",maximum:r.length}:{code:"too_small",minimum:r.length},inclusive:!0,exact:!0,input:o.value,inst:e,continue:!r.abort})}}),ne=u("$ZodCheckStringFormat",(e,r)=>{var t,o;S.init(e,r),e._zod.onattach.push(n=>{let i=n._zod.bag;i.format=r.format,r.pattern&&(i.patterns??(i.patterns=new Set),i.patterns.add(r.pattern))}),r.pattern?(t=e._zod).check??(t.check=n=>{r.pattern.lastIndex=0,!r.pattern.test(n.value)&&n.issues.push({origin:"string",code:"invalid_format",format:r.format,input:n.value,...r.pattern?{pattern:r.pattern.toString()}:{},inst:e,continue:!r.abort})}):(o=e._zod).check??(o.check=()=>{})}),ot=u("$ZodCheckRegex",(e,r)=>{ne.init(e,r),e._zod.check=t=>{r.pattern.lastIndex=0,!r.pattern.test(t.value)&&t.issues.push({origin:"string",code:"invalid_format",format:"regex",input:t.value,pattern:r.pattern.toString(),inst:e,continue:!r.abort})}}),nt=u("$ZodCheckLowerCase",(e,r)=>{r.pattern??(r.pattern=Hr),ne.init(e,r)}),st=u("$ZodCheckUpperCase",(e,r)=>{r.pattern??(r.pattern=Qr),ne.init(e,r)}),it=u("$ZodCheckIncludes",(e,r)=>{S.init(e,r);let t=C(r.includes),o=new RegExp(typeof r.position=="number"?`^.{${r.position}}${t}`:t);r.pattern=o,e._zod.onattach.push(n=>{let i=n._zod.bag;i.patterns??(i.patterns=new Set),i.patterns.add(o)}),e._zod.check=n=>{n.value.includes(r.includes,r.position)||n.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:r.includes,input:n.value,inst:e,continue:!r.abort})}}),ct=u("$ZodCheckStartsWith",(e,r)=>{S.init(e,r);let t=new RegExp(`^${C(r.prefix)}.*`);r.pattern??(r.pattern=t),e._zod.onattach.push(o=>{let n=o._zod.bag;n.patterns??(n.patterns=new Set),n.patterns.add(t)}),e._zod.check=o=>{o.value.startsWith(r.prefix)||o.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:r.prefix,input:o.value,inst:e,continue:!r.abort})}}),ut=u("$ZodCheckEndsWith",(e,r)=>{S.init(e,r);let t=new RegExp(`.*${C(r.suffix)}$`);r.pattern??(r.pattern=t),e._zod.onattach.push(o=>{let n=o._zod.bag;n.patterns??(n.patterns=new Set),n.patterns.add(t)}),e._zod.check=o=>{o.value.endsWith(r.suffix)||o.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:r.suffix,input:o.value,inst:e,continue:!r.abort})}});var at=u("$ZodCheckOverwrite",(e,r)=>{S.init(e,r),e._zod.check=t=>{t.value=r.tx(t.value)}});var fe=class{constructor(r=[]){this.content=[],this.indent=0,this&&(this.args=r)}indented(r){this.indent+=1,r(this),this.indent-=1}write(r){if(typeof r=="function"){r(this,{execution:"sync"}),r(this,{execution:"async"});return}let o=r.split(`
`).filter(s=>s),n=Math.min(...o.map(s=>s.length-s.trimStart().length)),i=o.map(s=>s.slice(n)).map(s=>" ".repeat(this.indent*2)+s);for(let s of i)this.content.push(s)}compile(){let r=Function,t=this?.args,n=[...(this?.content??[""]).map(i=>`  ${i}`)];return new r(...t,n.join(`
`))}};var lt={major:4,minor:4,patch:3};var $=u("$ZodType",(e,r)=>{var t;e??(e={}),e._zod.def=r,e._zod.bag=e._zod.bag||{},e._zod.version=lt;let o=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&o.unshift(e);for(let n of o)for(let i of n._zod.onattach)i(e);if(o.length===0)(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{let n=(s,c,a)=>{let p=D(s),l;for(let h of c){if(h._zod.def.when){if(Se(s)||!h._zod.def.when(s))continue}else if(p)continue;let m=s.issues.length,f=h._zod.check(s);if(f instanceof Promise&&a?.async===!1)throw new T;if(l||f instanceof Promise)l=(l??Promise.resolve()).then(async()=>{await f,s.issues.length!==m&&(p||(p=D(s,m)))});else{if(s.issues.length===m)continue;p||(p=D(s,m))}}return l?l.then(()=>s):s},i=(s,c,a)=>{if(D(s))return s.aborted=!0,s;let p=n(c,o,a);if(p instanceof Promise){if(a.async===!1)throw new T;return p.then(l=>e._zod.parse(l,a))}return e._zod.parse(p,a)};e._zod.run=(s,c)=>{if(c.skipChecks)return e._zod.parse(s,c);if(c.direction==="backward"){let p=e._zod.parse({value:s.value,issues:[]},{...c,skipChecks:!0});return p instanceof Promise?p.then(l=>i(l,s,c)):i(p,s,c)}let a=e._zod.parse(s,c);if(a instanceof Promise){if(c.async===!1)throw new T;return a.then(p=>n(p,o,c))}return n(a,o,c)}}_(e,"~standard",()=>({validate:n=>{try{let i=xr(e,n);return i.success?{value:i.data}:{issues:i.error?.issues}}catch{return zr(e,n).then(s=>s.success?{value:s.data}:{issues:s.error?.issues})}},vendor:"zod",version:1}))}),he=u("$ZodString",(e,r)=>{$.init(e,r),e._zod.pattern=[...e?._zod.bag?.patterns??[]].pop()??Yr(e._zod.bag),e._zod.parse=(t,o)=>{if(r.coerce)try{t.value=String(t.value)}catch{}return typeof t.value=="string"||t.issues.push({expected:"string",code:"invalid_type",input:t.value,inst:e}),t}}),z=u("$ZodStringFormat",(e,r)=>{ne.init(e,r),he.init(e,r)}),vt=u("$ZodGUID",(e,r)=>{r.pattern??(r.pattern=jr),z.init(e,r)}),yt=u("$ZodUUID",(e,r)=>{if(r.version){let o={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[r.version];if(o===void 0)throw new Error(`Invalid UUID version: "${r.version}"`);r.pattern??(r.pattern=Ee(o))}else r.pattern??(r.pattern=Ee());z.init(e,r)}),$t=u("$ZodEmail",(e,r)=>{r.pattern??(r.pattern=Cr),z.init(e,r)}),bt=u("$ZodURL",(e,r)=>{z.init(e,r),e._zod.check=t=>{try{let o=t.value.trim();if(!r.normalize&&r.protocol?.source===Jr.source&&!/^https?:\/\//i.test(o)){t.issues.push({code:"invalid_format",format:"url",note:"Invalid URL format",input:t.value,inst:e,continue:!r.abort});return}let n=new URL(o);r.hostname&&(r.hostname.lastIndex=0,r.hostname.test(n.hostname)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:r.hostname.source,input:t.value,inst:e,continue:!r.abort})),r.protocol&&(r.protocol.lastIndex=0,r.protocol.test(n.protocol.endsWith(":")?n.protocol.slice(0,-1):n.protocol)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:r.protocol.source,input:t.value,inst:e,continue:!r.abort})),r.normalize?t.value=n.href:t.value=o;return}catch{t.issues.push({code:"invalid_format",format:"url",input:t.value,inst:e,continue:!r.abort})}}}),wt=u("$ZodEmoji",(e,r)=>{r.pattern??(r.pattern=Rr()),z.init(e,r)}),kt=u("$ZodNanoID",(e,r)=>{r.pattern??(r.pattern=Nr),z.init(e,r)}),Zt=u("$ZodCUID",(e,r)=>{r.pattern??(r.pattern=Sr),z.init(e,r)}),Pt=u("$ZodCUID2",(e,r)=>{r.pattern??(r.pattern=Or),z.init(e,r)}),St=u("$ZodULID",(e,r)=>{r.pattern??(r.pattern=Er),z.init(e,r)}),Ot=u("$ZodXID",(e,r)=>{r.pattern??(r.pattern=Ir),z.init(e,r)}),Et=u("$ZodKSUID",(e,r)=>{r.pattern??(r.pattern=Tr),z.init(e,r)}),It=u("$ZodISODateTime",(e,r)=>{r.pattern??(r.pattern=qr(r)),z.init(e,r)}),Tt=u("$ZodISODate",(e,r)=>{r.pattern??(r.pattern=Wr),z.init(e,r)}),Nt=u("$ZodISOTime",(e,r)=>{r.pattern??(r.pattern=Gr(r)),z.init(e,r)}),At=u("$ZodISODuration",(e,r)=>{r.pattern??(r.pattern=Ar),z.init(e,r)}),jt=u("$ZodIPv4",(e,r)=>{r.pattern??(r.pattern=Dr),z.init(e,r),e._zod.bag.format="ipv4"}),Ct=u("$ZodIPv6",(e,r)=>{r.pattern??(r.pattern=Lr),z.init(e,r),e._zod.bag.format="ipv6",e._zod.check=t=>{try{new URL(`http://[${t.value}]`)}catch{t.issues.push({code:"invalid_format",format:"ipv6",input:t.value,inst:e,continue:!r.abort})}}});var Rt=u("$ZodCIDRv4",(e,r)=>{r.pattern??(r.pattern=Fr),z.init(e,r)}),Dt=u("$ZodCIDRv6",(e,r)=>{r.pattern??(r.pattern=Ur),z.init(e,r),e._zod.check=t=>{let o=t.value.split("/");try{if(o.length!==2)throw new Error;let[n,i]=o;if(!i)throw new Error;let s=Number(i);if(`${s}`!==i)throw new Error;if(s<0||s>128)throw new Error;new URL(`http://[${n}]`)}catch{t.issues.push({code:"invalid_format",format:"cidrv6",input:t.value,inst:e,continue:!r.abort})}}});function Lt(e){if(e==="")return!0;if(/\s/.test(e)||e.length%4!==0)return!1;try{return atob(e),!0}catch{return!1}}var Ft=u("$ZodBase64",(e,r)=>{r.pattern??(r.pattern=Mr),z.init(e,r),e._zod.bag.contentEncoding="base64",e._zod.check=t=>{Lt(t.value)||t.issues.push({code:"invalid_format",format:"base64",input:t.value,inst:e,continue:!r.abort})}});function $s(e){if(!Ie.test(e))return!1;let r=e.replace(/[-_]/g,o=>o==="-"?"+":"/"),t=r.padEnd(Math.ceil(r.length/4)*4,"=");return Lt(t)}var Ut=u("$ZodBase64URL",(e,r)=>{r.pattern??(r.pattern=Ie),z.init(e,r),e._zod.bag.contentEncoding="base64url",e._zod.check=t=>{$s(t.value)||t.issues.push({code:"invalid_format",format:"base64url",input:t.value,inst:e,continue:!r.abort})}}),Mt=u("$ZodE164",(e,r)=>{r.pattern??(r.pattern=Br),z.init(e,r)});function bs(e,r=null){try{let t=e.split(".");if(t.length!==3)return!1;let[o]=t;if(!o)return!1;let n=JSON.parse(atob(o));return!("typ"in n&&n?.typ!=="JWT"||!n.alg||r&&(!("alg"in n)||n.alg!==r))}catch{return!1}}var Jt=u("$ZodJWT",(e,r)=>{z.init(e,r),e._zod.check=t=>{bs(t.value,r.alg)||t.issues.push({code:"invalid_format",format:"jwt",input:t.value,inst:e,continue:!r.abort})}});var Bt=u("$ZodBoolean",(e,r)=>{$.init(e,r),e._zod.pattern=Xr,e._zod.parse=(t,o)=>{if(r.coerce)try{t.value=!!t.value}catch{}let n=t.value;return typeof n=="boolean"||t.issues.push({expected:"boolean",code:"invalid_type",input:n,inst:e}),t}});var Vt=u("$ZodUnknown",(e,r)=>{$.init(e,r),e._zod.parse=t=>t}),Wt=u("$ZodNever",(e,r)=>{$.init(e,r),e._zod.parse=(t,o)=>(t.issues.push({expected:"never",code:"invalid_type",input:t.value,inst:e}),t)});function ft(e,r,t){e.issues.length&&r.issues.push(...ee(t,e.issues)),r.value[t]=e.value}var Kt=u("$ZodArray",(e,r)=>{$.init(e,r),e._zod.parse=(t,o)=>{let n=t.value;if(!Array.isArray(n))return t.issues.push({expected:"array",code:"invalid_type",input:n,inst:e}),t;t.value=Array(n.length);let i=[];for(let s=0;s<n.length;s++){let c=n[s],a=r.element._zod.run({value:c,issues:[]},o);a instanceof Promise?i.push(a.then(p=>ft(p,t,s))):ft(a,t,s)}return i.length?Promise.all(i).then(()=>t):t}});function me(e,r,t,o,n,i){let s=t in o;if(e.issues.length){if(n&&i&&!s)return;r.issues.push(...ee(t,e.issues))}if(!s&&!n){e.issues.length||r.issues.push({code:"invalid_type",expected:"nonoptional",input:void 0,path:[t]});return}e.value===void 0?s&&(r.value[t]=void 0):r.value[t]=e.value}function Gt(e){let r=Object.keys(e.shape);for(let o of r)if(!e.shape?.[o]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${o}": expected a Zod schema`);let t=Pe(e.shape);return{...e,keys:r,keySet:new Set(r),numKeys:r.length,optionalKeys:new Set(t)}}function qt(e,r,t,o,n,i){let s=[],c=n.keySet,a=n.catchall._zod,p=a.def.type,l=a.optin==="optional",h=a.optout==="optional";for(let m in r){if(m==="__proto__"||c.has(m))continue;if(p==="never"){s.push(m);continue}let f=a.run({value:r[m],issues:[]},o);f instanceof Promise?e.push(f.then(x=>me(x,t,m,r,l,h))):me(f,t,m,r,l,h)}return s.length&&t.issues.push({code:"unrecognized_keys",keys:s,input:r,inst:i}),e.length?Promise.all(e).then(()=>t):t}var ws=u("$ZodObject",(e,r)=>{if($.init(e,r),!Object.getOwnPropertyDescriptor(r,"shape")?.get){let c=r.shape;Object.defineProperty(r,"shape",{get:()=>{let a={...c};return Object.defineProperty(r,"shape",{value:a}),a}})}let o=W(()=>Gt(r));_(e._zod,"propValues",()=>{let c=r.shape,a={};for(let p in c){let l=c[p]._zod;if(l.values){a[p]??(a[p]=new Set);for(let h of l.values)a[p].add(h)}}return a});let n=F,i=r.catchall,s;e._zod.parse=(c,a)=>{s??(s=o.value);let p=c.value;if(!n(p))return c.issues.push({expected:"object",code:"invalid_type",input:p,inst:e}),c;c.value={};let l=[],h=s.shape;for(let m of s.keys){let f=h[m],x=f._zod.optin==="optional",q=f._zod.optout==="optional",w=f._zod.run({value:p[m],issues:[]},a);w instanceof Promise?l.push(w.then(ye=>me(ye,c,m,p,x,q))):me(w,c,m,p,x,q)}return i?qt(l,p,c,a,o.value,e):l.length?Promise.all(l).then(()=>c):c}}),Yt=u("$ZodObjectJIT",(e,r)=>{ws.init(e,r);let t=e._zod.parse,o=W(()=>Gt(r)),n=m=>{let f=new fe(["shape","payload","ctx"]),x=o.value,q=I=>{let y=ie(I);return`shape[${y}]._zod.run({ value: input[${y}], issues: [] }, ctx)`};f.write("const input = payload.value;");let w=Object.create(null),ye=0;for(let I of x.keys)w[I]=`key_${ye++}`;f.write("const newResult = {};");for(let I of x.keys){let y=w[I],Z=ie(I),tr=m[I],or=tr?._zod?.optin==="optional",Bn=tr?._zod?.optout==="optional";f.write(`const ${y} = ${q(I)};`),or&&Bn?f.write(`
        if (${y}.issues.length) {
          if (${Z} in input) {
            payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${Z}, ...iss.path] : [${Z}]
            })));
          }
        }
        
        if (${y}.value === undefined) {
          if (${Z} in input) {
            newResult[${Z}] = undefined;
          }
        } else {
          newResult[${Z}] = ${y}.value;
        }
        
      `):or?f.write(`
        if (${y}.issues.length) {
          payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${Z}, ...iss.path] : [${Z}]
          })));
        }
        
        if (${y}.value === undefined) {
          if (${Z} in input) {
            newResult[${Z}] = undefined;
          }
        } else {
          newResult[${Z}] = ${y}.value;
        }
        
      `):f.write(`
        const ${y}_present = ${Z} in input;
        if (${y}.issues.length) {
          payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${Z}, ...iss.path] : [${Z}]
          })));
        }
        if (!${y}_present && !${y}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${Z}]
          });
        }

        if (${y}_present) {
          if (${y}.value === undefined) {
            newResult[${Z}] = undefined;
          } else {
            newResult[${Z}] = ${y}.value;
          }
        }

      `)}f.write("payload.value = newResult;"),f.write("return payload;");let Jn=f.compile();return(I,y)=>Jn(m,I,y)},i,s=F,c=!B.jitless,p=c&&ke.value,l=r.catchall,h;e._zod.parse=(m,f)=>{h??(h=o.value);let x=m.value;return s(x)?c&&p&&f?.async===!1&&f.jitless!==!0?(i||(i=n(r.shape)),m=i(m,f),l?qt([],x,m,f,h,e):m):t(m,f):(m.issues.push({expected:"object",code:"invalid_type",input:x,inst:e}),m)}});function dt(e,r,t,o){for(let i of e)if(i.issues.length===0)return r.value=i.value,r;let n=e.filter(i=>!D(i));return n.length===1?(r.value=n[0].value,n[0]):(r.issues.push({code:"invalid_union",input:r.value,inst:t,errors:e.map(i=>i.issues.map(s=>N(s,o,A())))}),r)}var Ne=u("$ZodUnion",(e,r)=>{$.init(e,r),_(e._zod,"optin",()=>r.options.some(o=>o._zod.optin==="optional")?"optional":void 0),_(e._zod,"optout",()=>r.options.some(o=>o._zod.optout==="optional")?"optional":void 0),_(e._zod,"values",()=>{if(r.options.every(o=>o._zod.values))return new Set(r.options.flatMap(o=>Array.from(o._zod.values)))}),_(e._zod,"pattern",()=>{if(r.options.every(o=>o._zod.pattern)){let o=r.options.map(n=>n._zod.pattern);return new RegExp(`^(${o.map(n=>Q(n.source)).join("|")})$`)}});let t=r.options.length===1?r.options[0]._zod.run:null;e._zod.parse=(o,n)=>{if(t)return t(o,n);let i=!1,s=[];for(let c of r.options){let a=c._zod.run({value:o.value,issues:[]},n);if(a instanceof Promise)s.push(a),i=!0;else{if(a.issues.length===0)return a;s.push(a)}}return i?Promise.all(s).then(c=>dt(c,o,e,n)):dt(s,o,e,n)}});var Xt=u("$ZodDiscriminatedUnion",(e,r)=>{r.inclusive=!1,Ne.init(e,r);let t=e._zod.parse;_(e._zod,"propValues",()=>{let n={};for(let i of r.options){let s=i._zod.propValues;if(!s||Object.keys(s).length===0)throw new Error(`Invalid discriminated union option at index "${r.options.indexOf(i)}"`);for(let[c,a]of Object.entries(s)){n[c]||(n[c]=new Set);for(let p of a)n[c].add(p)}}return n});let o=W(()=>{let n=r.options,i=new Map;for(let s of n){let c=s._zod.propValues?.[r.discriminator];if(!c||c.size===0)throw new Error(`Invalid discriminated union option at index "${r.options.indexOf(s)}"`);for(let a of c){if(i.has(a))throw new Error(`Duplicate discriminator value "${String(a)}"`);i.set(a,s)}}return i});e._zod.parse=(n,i)=>{let s=n.value;if(!F(s))return n.issues.push({code:"invalid_type",expected:"object",input:s,inst:e}),n;let c=o.value.get(s?.[r.discriminator]);return c?c._zod.run(n,i):r.unionFallback||i.direction==="backward"?t(n,i):(n.issues.push({code:"invalid_union",errors:[],note:"No matching discriminator",discriminator:r.discriminator,options:Array.from(o.value.keys()),input:s,path:[r.discriminator],inst:e}),n)}}),Ht=u("$ZodIntersection",(e,r)=>{$.init(e,r),e._zod.parse=(t,o)=>{let n=t.value,i=r.left._zod.run({value:n,issues:[]},o),s=r.right._zod.run({value:n,issues:[]},o);return i instanceof Promise||s instanceof Promise?Promise.all([i,s]).then(([a,p])=>mt(t,a,p)):mt(t,i,s)}});function Te(e,r){if(e===r)return{valid:!0,data:e};if(e instanceof Date&&r instanceof Date&&+e==+r)return{valid:!0,data:e};if(U(e)&&U(r)){let t=Object.keys(r),o=Object.keys(e).filter(i=>t.indexOf(i)!==-1),n={...e,...r};for(let i of o){let s=Te(e[i],r[i]);if(!s.valid)return{valid:!1,mergeErrorPath:[i,...s.mergeErrorPath]};n[i]=s.data}return{valid:!0,data:n}}if(Array.isArray(e)&&Array.isArray(r)){if(e.length!==r.length)return{valid:!1,mergeErrorPath:[]};let t=[];for(let o=0;o<e.length;o++){let n=e[o],i=r[o],s=Te(n,i);if(!s.valid)return{valid:!1,mergeErrorPath:[o,...s.mergeErrorPath]};t.push(s.data)}return{valid:!0,data:t}}return{valid:!1,mergeErrorPath:[]}}function mt(e,r,t){let o=new Map,n;for(let c of r.issues)if(c.code==="unrecognized_keys"){n??(n=c);for(let a of c.keys)o.has(a)||o.set(a,{}),o.get(a).l=!0}else e.issues.push(c);for(let c of t.issues)if(c.code==="unrecognized_keys")for(let a of c.keys)o.has(a)||o.set(a,{}),o.get(a).r=!0;else e.issues.push(c);let i=[...o].filter(([,c])=>c.l&&c.r).map(([c])=>c);if(i.length&&n&&e.issues.push({...n,keys:i}),D(e))return e;let s=Te(r.value,t.value);if(!s.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(s.mergeErrorPath)}`);return e.value=s.data,e}var Qt=u("$ZodEnum",(e,r)=>{$.init(e,r);let t=X(r.entries),o=new Set(t);e._zod.values=o,e._zod.pattern=new RegExp(`^(${t.filter(n=>Ze.has(typeof n)).map(n=>typeof n=="string"?C(n):n.toString()).join("|")})$`),e._zod.parse=(n,i)=>{let s=n.value;return o.has(s)||n.issues.push({code:"invalid_value",values:t,input:s,inst:e}),n}}),eo=u("$ZodLiteral",(e,r)=>{if($.init(e,r),r.values.length===0)throw new Error("Cannot create literal schema with no valid values");let t=new Set(r.values);e._zod.values=t,e._zod.pattern=new RegExp(`^(${r.values.map(o=>typeof o=="string"?C(o):o?C(o.toString()):String(o)).join("|")})$`),e._zod.parse=(o,n)=>{let i=o.value;return t.has(i)||o.issues.push({code:"invalid_value",values:r.values,input:i,inst:e}),o}});var ro=u("$ZodTransform",(e,r)=>{$.init(e,r),e._zod.optin="optional",e._zod.parse=(t,o)=>{if(o.direction==="backward")throw new J(e.constructor.name);let n=r.transform(t.value,t);if(o.async)return(n instanceof Promise?n:Promise.resolve(n)).then(s=>(t.value=s,t.fallback=!0,t));if(n instanceof Promise)throw new T;return t.value=n,t.fallback=!0,t}});function ht(e,r){return r===void 0&&(e.issues.length||e.fallback)?{issues:[],value:void 0}:e}var Ae=u("$ZodOptional",(e,r)=>{$.init(e,r),e._zod.optin="optional",e._zod.optout="optional",_(e._zod,"values",()=>r.innerType._zod.values?new Set([...r.innerType._zod.values,void 0]):void 0),_(e._zod,"pattern",()=>{let t=r.innerType._zod.pattern;return t?new RegExp(`^(${Q(t.source)})?$`):void 0}),e._zod.parse=(t,o)=>{if(r.innerType._zod.optin==="optional"){let n=t.value,i=r.innerType._zod.run(t,o);return i instanceof Promise?i.then(s=>ht(s,n)):ht(i,n)}return t.value===void 0?t:r.innerType._zod.run(t,o)}}),to=u("$ZodExactOptional",(e,r)=>{Ae.init(e,r),_(e._zod,"values",()=>r.innerType._zod.values),_(e._zod,"pattern",()=>r.innerType._zod.pattern),e._zod.parse=(t,o)=>r.innerType._zod.run(t,o)}),oo=u("$ZodNullable",(e,r)=>{$.init(e,r),_(e._zod,"optin",()=>r.innerType._zod.optin),_(e._zod,"optout",()=>r.innerType._zod.optout),_(e._zod,"pattern",()=>{let t=r.innerType._zod.pattern;return t?new RegExp(`^(${Q(t.source)}|null)$`):void 0}),_(e._zod,"values",()=>r.innerType._zod.values?new Set([...r.innerType._zod.values,null]):void 0),e._zod.parse=(t,o)=>t.value===null?t:r.innerType._zod.run(t,o)}),no=u("$ZodDefault",(e,r)=>{$.init(e,r),e._zod.optin="optional",_(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(t,o)=>{if(o.direction==="backward")return r.innerType._zod.run(t,o);if(t.value===void 0)return t.value=r.defaultValue,t;let n=r.innerType._zod.run(t,o);return n instanceof Promise?n.then(i=>_t(i,r)):_t(n,r)}});function _t(e,r){return e.value===void 0&&(e.value=r.defaultValue),e}var so=u("$ZodPrefault",(e,r)=>{$.init(e,r),e._zod.optin="optional",_(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(t,o)=>(o.direction==="backward"||t.value===void 0&&(t.value=r.defaultValue),r.innerType._zod.run(t,o))}),io=u("$ZodNonOptional",(e,r)=>{$.init(e,r),_(e._zod,"values",()=>{let t=r.innerType._zod.values;return t?new Set([...t].filter(o=>o!==void 0)):void 0}),e._zod.parse=(t,o)=>{let n=r.innerType._zod.run(t,o);return n instanceof Promise?n.then(i=>gt(i,e)):gt(n,e)}});function gt(e,r){return!e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:r}),e}var co=u("$ZodCatch",(e,r)=>{$.init(e,r),e._zod.optin="optional",_(e._zod,"optout",()=>r.innerType._zod.optout),_(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(t,o)=>{if(o.direction==="backward")return r.innerType._zod.run(t,o);let n=r.innerType._zod.run(t,o);return n instanceof Promise?n.then(i=>(t.value=i.value,i.issues.length&&(t.value=r.catchValue({...t,error:{issues:i.issues.map(s=>N(s,o,A()))},input:t.value}),t.issues=[],t.fallback=!0),t)):(t.value=n.value,n.issues.length&&(t.value=r.catchValue({...t,error:{issues:n.issues.map(i=>N(i,o,A()))},input:t.value}),t.issues=[],t.fallback=!0),t)}});var uo=u("$ZodPipe",(e,r)=>{$.init(e,r),_(e._zod,"values",()=>r.in._zod.values),_(e._zod,"optin",()=>r.in._zod.optin),_(e._zod,"optout",()=>r.out._zod.optout),_(e._zod,"propValues",()=>r.in._zod.propValues),e._zod.parse=(t,o)=>{if(o.direction==="backward"){let i=r.out._zod.run(t,o);return i instanceof Promise?i.then(s=>de(s,r.in,o)):de(i,r.in,o)}let n=r.in._zod.run(t,o);return n instanceof Promise?n.then(i=>de(i,r.out,o)):de(n,r.out,o)}});function de(e,r,t){return e.issues.length?(e.aborted=!0,e):r._zod.run({value:e.value,issues:e.issues,fallback:e.fallback},t)}var ao=u("$ZodReadonly",(e,r)=>{$.init(e,r),_(e._zod,"propValues",()=>r.innerType._zod.propValues),_(e._zod,"values",()=>r.innerType._zod.values),_(e._zod,"optin",()=>r.innerType?._zod?.optin),_(e._zod,"optout",()=>r.innerType?._zod?.optout),e._zod.parse=(t,o)=>{if(o.direction==="backward")return r.innerType._zod.run(t,o);let n=r.innerType._zod.run(t,o);return n instanceof Promise?n.then(xt):xt(n)}});function xt(e){return e.value=Object.freeze(e.value),e}var po=u("$ZodCustom",(e,r)=>{S.init(e,r),$.init(e,r),e._zod.parse=(t,o)=>t,e._zod.check=t=>{let o=t.value,n=r.fn(o);if(n instanceof Promise)return n.then(i=>zt(i,t,o,e));zt(n,t,o,e)}});function zt(e,r,t,o){if(!e){let n={code:"custom",input:t,inst:o,path:[...o._zod.def.path??[]],continue:!o._zod.def.abort};o._zod.def.params&&(n.params=o._zod.def.params),r.issues.push(K(n))}}var lo;var je=class{constructor(){this._map=new WeakMap,this._idmap=new Map}add(r,...t){let o=t[0];return this._map.set(r,o),o&&typeof o=="object"&&"id"in o&&this._idmap.set(o.id,r),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(r){let t=this._map.get(r);return t&&typeof t=="object"&&"id"in t&&this._idmap.delete(t.id),this._map.delete(r),this}get(r){let t=r._zod.parent;if(t){let o={...this.get(t)??{}};delete o.id;let n={...o,...this._map.get(r)};return Object.keys(n).length?n:void 0}return this._map.get(r)}has(r){return this._map.has(r)}};function ks(){return new je}(lo=globalThis).__zod_globalRegistry??(lo.__zod_globalRegistry=ks());var M=globalThis.__zod_globalRegistry;function fo(e,r){return new e({type:"string",...d(r)})}function mo(e,r){return new e({type:"string",format:"email",check:"string_format",abort:!1,...d(r)})}function Ce(e,r){return new e({type:"string",format:"guid",check:"string_format",abort:!1,...d(r)})}function ho(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,...d(r)})}function _o(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...d(r)})}function go(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...d(r)})}function xo(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...d(r)})}function zo(e,r){return new e({type:"string",format:"url",check:"string_format",abort:!1,...d(r)})}function vo(e,r){return new e({type:"string",format:"emoji",check:"string_format",abort:!1,...d(r)})}function yo(e,r){return new e({type:"string",format:"nanoid",check:"string_format",abort:!1,...d(r)})}function $o(e,r){return new e({type:"string",format:"cuid",check:"string_format",abort:!1,...d(r)})}function bo(e,r){return new e({type:"string",format:"cuid2",check:"string_format",abort:!1,...d(r)})}function wo(e,r){return new e({type:"string",format:"ulid",check:"string_format",abort:!1,...d(r)})}function ko(e,r){return new e({type:"string",format:"xid",check:"string_format",abort:!1,...d(r)})}function Zo(e,r){return new e({type:"string",format:"ksuid",check:"string_format",abort:!1,...d(r)})}function Po(e,r){return new e({type:"string",format:"ipv4",check:"string_format",abort:!1,...d(r)})}function So(e,r){return new e({type:"string",format:"ipv6",check:"string_format",abort:!1,...d(r)})}function Oo(e,r){return new e({type:"string",format:"cidrv4",check:"string_format",abort:!1,...d(r)})}function Eo(e,r){return new e({type:"string",format:"cidrv6",check:"string_format",abort:!1,...d(r)})}function Io(e,r){return new e({type:"string",format:"base64",check:"string_format",abort:!1,...d(r)})}function To(e,r){return new e({type:"string",format:"base64url",check:"string_format",abort:!1,...d(r)})}function No(e,r){return new e({type:"string",format:"e164",check:"string_format",abort:!1,...d(r)})}function Ao(e,r){return new e({type:"string",format:"jwt",check:"string_format",abort:!1,...d(r)})}function jo(e,r){return new e({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...d(r)})}function Co(e,r){return new e({type:"string",format:"date",check:"string_format",...d(r)})}function Ro(e,r){return new e({type:"string",format:"time",check:"string_format",precision:null,...d(r)})}function Do(e,r){return new e({type:"string",format:"duration",check:"string_format",...d(r)})}function Lo(e,r){return new e({type:"boolean",...d(r)})}function Fo(e){return new e({type:"unknown"})}function Uo(e,r){return new e({type:"never",...d(r)})}function _e(e,r){return new et({check:"max_length",...d(r),maximum:e})}function G(e,r){return new rt({check:"min_length",...d(r),minimum:e})}function ge(e,r){return new tt({check:"length_equals",...d(r),length:e})}function Re(e,r){return new ot({check:"string_format",format:"regex",...d(r),pattern:e})}function De(e){return new nt({check:"string_format",format:"lowercase",...d(e)})}function Le(e){return new st({check:"string_format",format:"uppercase",...d(e)})}function Fe(e,r){return new it({check:"string_format",format:"includes",...d(r),includes:e})}function Ue(e,r){return new ct({check:"string_format",format:"starts_with",...d(r),prefix:e})}function Me(e,r){return new ut({check:"string_format",format:"ends_with",...d(r),suffix:e})}function L(e){return new at({check:"overwrite",tx:e})}function Je(e){return L(r=>r.normalize(e))}function Be(){return L(e=>e.trim())}function Ve(){return L(e=>e.toLowerCase())}function We(){return L(e=>e.toUpperCase())}function Ke(){return L(e=>we(e))}function Mo(e,r,t){return new e({type:"array",element:r,...d(t)})}function Jo(e,r,t){return new e({type:"custom",check:"custom",fn:r,...d(t)})}function Bo(e,r){let t=Zs(o=>(o.addIssue=n=>{if(typeof n=="string")o.issues.push(K(n,o.value,t._zod.def));else{let i=n;i.fatal&&(i.continue=!1),i.code??(i.code="custom"),i.input??(i.input=o.value),i.inst??(i.inst=t),i.continue??(i.continue=!t._zod.def.abort),o.issues.push(K(i))}},e(o.value,o)),r);return t}function Zs(e,r){let t=new S({check:"custom",...d(r)});return t._zod.check=e,t}function Ge(e){let r=e?.target??"draft-2020-12";return r==="draft-4"&&(r="draft-04"),r==="draft-7"&&(r="draft-07"),{processors:e.processors??{},metadataRegistry:e?.metadata??M,target:r,unrepresentable:e?.unrepresentable??"throw",override:e?.override??(()=>{}),io:e?.io??"output",counter:0,seen:new Map,cycles:e?.cycles??"ref",reused:e?.reused??"inline",external:e?.external??void 0}}function k(e,r,t={path:[],schemaPath:[]}){var o;let n=e._zod.def,i=r.seen.get(e);if(i)return i.count++,t.schemaPath.includes(e)&&(i.cycle=t.path),i.schema;let s={schema:{},count:1,cycle:void 0,path:t.path};r.seen.set(e,s);let c=e._zod.toJSONSchema?.();if(c)s.schema=c;else{let l={...t,schemaPath:[...t.schemaPath,e],path:t.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(r,s.schema,l);else{let m=s.schema,f=r.processors[n.type];if(!f)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${n.type}`);f(e,r,m,l)}let h=e._zod.parent;h&&(s.ref||(s.ref=h),k(h,r,l),r.seen.get(h).isParent=!0)}let a=r.metadataRegistry.get(e);return a&&Object.assign(s.schema,a),r.io==="input"&&P(e)&&(delete s.schema.examples,delete s.schema.default),r.io==="input"&&"_prefault"in s.schema&&((o=s.schema).default??(o.default=s.schema._prefault)),delete s.schema._prefault,r.seen.get(e).schema}function qe(e,r){let t=e.seen.get(r);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");let o=new Map;for(let s of e.seen.entries()){let c=e.metadataRegistry.get(s[0])?.id;if(c){let a=o.get(c);if(a&&a!==s[0])throw new Error(`Duplicate schema id "${c}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);o.set(c,s[0])}}let n=s=>{let c=e.target==="draft-2020-12"?"$defs":"definitions";if(e.external){let h=e.external.registry.get(s[0])?.id,m=e.external.uri??(x=>x);if(h)return{ref:m(h)};let f=s[1].defId??s[1].schema.id??`schema${e.counter++}`;return s[1].defId=f,{defId:f,ref:`${m("__shared")}#/${c}/${f}`}}if(s[1]===t)return{ref:"#"};let p=`#/${c}/`,l=s[1].schema.id??`__schema${e.counter++}`;return{defId:l,ref:p+l}},i=s=>{if(s[1].schema.$ref)return;let c=s[1],{ref:a,defId:p}=n(s);c.def={...c.schema},p&&(c.defId=p);let l=c.schema;for(let h in l)delete l[h];l.$ref=a};if(e.cycles==="throw")for(let s of e.seen.entries()){let c=s[1];if(c.cycle)throw new Error(`Cycle detected: #/${c.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(let s of e.seen.entries()){let c=s[1];if(r===s[0]){i(s);continue}if(e.external){let p=e.external.registry.get(s[0])?.id;if(r!==s[0]&&p){i(s);continue}}if(e.metadataRegistry.get(s[0])?.id){i(s);continue}if(c.cycle){i(s);continue}if(c.count>1&&e.reused==="ref"){i(s);continue}}}function Ye(e,r){let t=e.seen.get(r);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");let o=c=>{let a=e.seen.get(c);if(a.ref===null)return;let p=a.def??a.schema,l={...p},h=a.ref;if(a.ref=null,h){o(h);let f=e.seen.get(h),x=f.schema;if(x.$ref&&(e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0")?(p.allOf=p.allOf??[],p.allOf.push(x)):Object.assign(p,x),Object.assign(p,l),c._zod.parent===h)for(let w in p)w==="$ref"||w==="allOf"||w in l||delete p[w];if(x.$ref&&f.def)for(let w in p)w==="$ref"||w==="allOf"||w in f.def&&JSON.stringify(p[w])===JSON.stringify(f.def[w])&&delete p[w]}let m=c._zod.parent;if(m&&m!==h){o(m);let f=e.seen.get(m);if(f?.schema.$ref&&(p.$ref=f.schema.$ref,f.def))for(let x in p)x==="$ref"||x==="allOf"||x in f.def&&JSON.stringify(p[x])===JSON.stringify(f.def[x])&&delete p[x]}e.override({zodSchema:c,jsonSchema:p,path:a.path??[]})};for(let c of[...e.seen.entries()].reverse())o(c[0]);let n={};if(e.target==="draft-2020-12"?n.$schema="https://json-schema.org/draft/2020-12/schema":e.target==="draft-07"?n.$schema="http://json-schema.org/draft-07/schema#":e.target==="draft-04"?n.$schema="http://json-schema.org/draft-04/schema#":e.target,e.external?.uri){let c=e.external.registry.get(r)?.id;if(!c)throw new Error("Schema is missing an `id` property");n.$id=e.external.uri(c)}Object.assign(n,t.def??t.schema);let i=e.metadataRegistry.get(r)?.id;i!==void 0&&n.id===i&&delete n.id;let s=e.external?.defs??{};for(let c of e.seen.entries()){let a=c[1];a.def&&a.defId&&(a.def.id===a.defId&&delete a.def.id,s[a.defId]=a.def)}e.external||Object.keys(s).length>0&&(e.target==="draft-2020-12"?n.$defs=s:n.definitions=s);try{let c=JSON.parse(JSON.stringify(n));return Object.defineProperty(c,"~standard",{value:{...r["~standard"],jsonSchema:{input:se(r,"input",e.processors),output:se(r,"output",e.processors)}},enumerable:!1,writable:!1}),c}catch{throw new Error("Error converting schema to JSON.")}}function P(e,r){let t=r??{seen:new Set};if(t.seen.has(e))return!1;t.seen.add(e);let o=e._zod.def;if(o.type==="transform")return!0;if(o.type==="array")return P(o.element,t);if(o.type==="set")return P(o.valueType,t);if(o.type==="lazy")return P(o.getter(),t);if(o.type==="promise"||o.type==="optional"||o.type==="nonoptional"||o.type==="nullable"||o.type==="readonly"||o.type==="default"||o.type==="prefault")return P(o.innerType,t);if(o.type==="intersection")return P(o.left,t)||P(o.right,t);if(o.type==="record"||o.type==="map")return P(o.keyType,t)||P(o.valueType,t);if(o.type==="pipe")return e._zod.traits.has("$ZodCodec")?!0:P(o.in,t)||P(o.out,t);if(o.type==="object"){for(let n in o.shape)if(P(o.shape[n],t))return!0;return!1}if(o.type==="union"){for(let n of o.options)if(P(n,t))return!0;return!1}if(o.type==="tuple"){for(let n of o.items)if(P(n,t))return!0;return!!(o.rest&&P(o.rest,t))}return!1}var Vo=(e,r={})=>t=>{let o=Ge({...t,processors:r});return k(e,o),qe(o,e),Ye(o,e)},se=(e,r,t={})=>o=>{let{libraryOptions:n,target:i}=o??{},s=Ge({...n??{},target:i,io:r,processors:t});return k(e,s),qe(s,e),Ye(s,e)};var Ps={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},Wo=(e,r,t,o)=>{let n=t;n.type="string";let{minimum:i,maximum:s,format:c,patterns:a,contentEncoding:p}=e._zod.bag;if(typeof i=="number"&&(n.minLength=i),typeof s=="number"&&(n.maxLength=s),c&&(n.format=Ps[c]??c,n.format===""&&delete n.format,c==="time"&&delete n.format),p&&(n.contentEncoding=p),a&&a.size>0){let l=[...a];l.length===1?n.pattern=l[0].source:l.length>1&&(n.allOf=[...l.map(h=>({...r.target==="draft-07"||r.target==="draft-04"||r.target==="openapi-3.0"?{type:"string"}:{},pattern:h.source}))])}};var Ko=(e,r,t,o)=>{t.type="boolean"};var Go=(e,r,t,o)=>{t.not={}};var qo=(e,r,t,o)=>{};var Yo=(e,r,t,o)=>{let n=e._zod.def,i=X(n.entries);i.every(s=>typeof s=="number")&&(t.type="number"),i.every(s=>typeof s=="string")&&(t.type="string"),t.enum=i},Xo=(e,r,t,o)=>{let n=e._zod.def,i=[];for(let s of n.values)if(s===void 0){if(r.unrepresentable==="throw")throw new Error("Literal `undefined` cannot be represented in JSON Schema")}else if(typeof s=="bigint"){if(r.unrepresentable==="throw")throw new Error("BigInt literals cannot be represented in JSON Schema");i.push(Number(s))}else i.push(s);if(i.length!==0)if(i.length===1){let s=i[0];t.type=s===null?"null":typeof s,r.target==="draft-04"||r.target==="openapi-3.0"?t.enum=[s]:t.const=s}else i.every(s=>typeof s=="number")&&(t.type="number"),i.every(s=>typeof s=="string")&&(t.type="string"),i.every(s=>typeof s=="boolean")&&(t.type="boolean"),i.every(s=>s===null)&&(t.type="null"),t.enum=i};var Ho=(e,r,t,o)=>{if(r.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")};var Qo=(e,r,t,o)=>{if(r.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")};var en=(e,r,t,o)=>{let n=t,i=e._zod.def,{minimum:s,maximum:c}=e._zod.bag;typeof s=="number"&&(n.minItems=s),typeof c=="number"&&(n.maxItems=c),n.type="array",n.items=k(i.element,r,{...o,path:[...o.path,"items"]})},rn=(e,r,t,o)=>{let n=t,i=e._zod.def;n.type="object",n.properties={};let s=i.shape;for(let p in s)n.properties[p]=k(s[p],r,{...o,path:[...o.path,"properties",p]});let c=new Set(Object.keys(s)),a=new Set([...c].filter(p=>{let l=i.shape[p]._zod;return r.io==="input"?l.optin===void 0:l.optout===void 0}));a.size>0&&(n.required=Array.from(a)),i.catchall?._zod.def.type==="never"?n.additionalProperties=!1:i.catchall?i.catchall&&(n.additionalProperties=k(i.catchall,r,{...o,path:[...o.path,"additionalProperties"]})):r.io==="output"&&(n.additionalProperties=!1)},tn=(e,r,t,o)=>{let n=e._zod.def,i=n.inclusive===!1,s=n.options.map((c,a)=>k(c,r,{...o,path:[...o.path,i?"oneOf":"anyOf",a]}));i?t.oneOf=s:t.anyOf=s},on=(e,r,t,o)=>{let n=e._zod.def,i=k(n.left,r,{...o,path:[...o.path,"allOf",0]}),s=k(n.right,r,{...o,path:[...o.path,"allOf",1]}),c=p=>"allOf"in p&&Object.keys(p).length===1,a=[...c(i)?i.allOf:[i],...c(s)?s.allOf:[s]];t.allOf=a};var nn=(e,r,t,o)=>{let n=e._zod.def,i=k(n.innerType,r,o),s=r.seen.get(e);r.target==="openapi-3.0"?(s.ref=n.innerType,t.nullable=!0):t.anyOf=[i,{type:"null"}]},sn=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType},cn=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType,t.default=JSON.parse(JSON.stringify(n.defaultValue))},un=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType,r.io==="input"&&(t._prefault=JSON.parse(JSON.stringify(n.defaultValue)))},an=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType;let s;try{s=n.catchValue(void 0)}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}t.default=s},pn=(e,r,t,o)=>{let n=e._zod.def,i=n.in._zod.traits.has("$ZodTransform"),s=r.io==="input"?i?n.out:n.in:n.out;k(s,r,o);let c=r.seen.get(e);c.ref=s},ln=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType,t.readOnly=!0};var Xe=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType};var Ls=u("ZodISODateTime",(e,r)=>{It.init(e,r),v.init(e,r)});function fn(e){return jo(Ls,e)}var Fs=u("ZodISODate",(e,r)=>{Tt.init(e,r),v.init(e,r)});function dn(e){return Co(Fs,e)}var Us=u("ZodISOTime",(e,r)=>{Nt.init(e,r),v.init(e,r)});function mn(e){return Ro(Us,e)}var Ms=u("ZodISODuration",(e,r)=>{At.init(e,r),v.init(e,r)});function hn(e){return Do(Ms,e)}var Vs=(e,r)=>{ue.init(e,r),e.name="ZodError",Object.defineProperties(e,{format:{value:t=>gr(e,t)},flatten:{value:t=>_r(e,t)},addIssue:{value:t=>{e.issues.push(t),e.message=JSON.stringify(e.issues,V,2)}},addIssues:{value:t=>{e.issues.push(...t),e.message=JSON.stringify(e.issues,V,2)}},isEmpty:{get(){return e.issues.length===0}}})};var O=u("ZodError",Vs,{Parent:Error});var _n=ae(O),gn=pe(O),xn=te(O),zn=oe(O),vn=vr(O),yn=yr(O),$n=$r(O),bn=br(O),wn=wr(O),kn=kr(O),Zn=Zr(O),Pn=Pr(O);var Sn=new WeakMap;function ve(e,r,t){let o=Object.getPrototypeOf(e),n=Sn.get(o);if(n||(n=new Set,Sn.set(o,n)),!n.has(r)){n.add(r);for(let i in t){let s=t[i];Object.defineProperty(o,i,{configurable:!0,enumerable:!1,get(){let c=s.bind(this);return Object.defineProperty(this,i,{configurable:!0,writable:!0,enumerable:!0,value:c}),c},set(c){Object.defineProperty(this,i,{configurable:!0,writable:!0,enumerable:!0,value:c})}})}}}var b=u("ZodType",(e,r)=>($.init(e,r),Object.assign(e["~standard"],{jsonSchema:{input:se(e,"input"),output:se(e,"output")}}),e.toJSONSchema=Vo(e,{}),e.def=r,e.type=r.type,Object.defineProperty(e,"_def",{value:r}),e.parse=(t,o)=>_n(e,t,o,{callee:e.parse}),e.safeParse=(t,o)=>xn(e,t,o),e.parseAsync=async(t,o)=>gn(e,t,o,{callee:e.parseAsync}),e.safeParseAsync=async(t,o)=>zn(e,t,o),e.spa=e.safeParseAsync,e.encode=(t,o)=>vn(e,t,o),e.decode=(t,o)=>yn(e,t,o),e.encodeAsync=async(t,o)=>$n(e,t,o),e.decodeAsync=async(t,o)=>bn(e,t,o),e.safeEncode=(t,o)=>wn(e,t,o),e.safeDecode=(t,o)=>kn(e,t,o),e.safeEncodeAsync=async(t,o)=>Zn(e,t,o),e.safeDecodeAsync=async(t,o)=>Pn(e,t,o),ve(e,"ZodType",{check(...t){let o=this.def;return this.clone(g.mergeDefs(o,{checks:[...o.checks??[],...t.map(n=>typeof n=="function"?{_zod:{check:n,def:{check:"custom"},onattach:[]}}:n)]}),{parent:!0})},with(...t){return this.check(...t)},clone(t,o){return E(this,t,o)},brand(){return this},register(t,o){return t.add(this,o),this},refine(t,o){return this.check(Ri(t,o))},superRefine(t,o){return this.check(Di(t,o))},overwrite(t){return this.check(L(t))},optional(){return In(this)},exactOptional(){return wi(this)},nullable(){return Tn(this)},nullish(){return In(Tn(this))},nonoptional(t){return Ei(this,t)},array(){return Qe(this)},or(t){return er([this,t])},and(t){return zi(this,t)},transform(t){return Nn(this,$i(t))},default(t){return Pi(this,t)},prefault(t){return Oi(this,t)},catch(t){return Ti(this,t)},pipe(t){return Nn(this,t)},readonly(){return ji(this)},describe(t){let o=this.clone();return M.add(o,{description:t}),o},meta(...t){if(t.length===0)return M.get(this);let o=this.clone();return M.add(o,t[0]),o},isOptional(){return this.safeParse(void 0).success},isNullable(){return this.safeParse(null).success},apply(t){return t(this)}}),Object.defineProperty(e,"description",{get(){return M.get(e)?.description},configurable:!0}),e)),An=u("_ZodString",(e,r)=>{he.init(e,r),b.init(e,r),e._zod.processJSONSchema=(o,n,i)=>Wo(e,o,n,i);let t=e._zod.bag;e.format=t.format??null,e.minLength=t.minimum??null,e.maxLength=t.maximum??null,ve(e,"_ZodString",{regex(...o){return this.check(Re(...o))},includes(...o){return this.check(Fe(...o))},startsWith(...o){return this.check(Ue(...o))},endsWith(...o){return this.check(Me(...o))},min(...o){return this.check(G(...o))},max(...o){return this.check(_e(...o))},length(...o){return this.check(ge(...o))},nonempty(...o){return this.check(G(1,...o))},lowercase(o){return this.check(De(o))},uppercase(o){return this.check(Le(o))},trim(){return this.check(Be())},normalize(...o){return this.check(Je(...o))},toLowerCase(){return this.check(Ve())},toUpperCase(){return this.check(We())},slugify(){return this.check(Ke())}})}),Ks=u("ZodString",(e,r)=>{he.init(e,r),An.init(e,r),e.email=t=>e.check(mo(Gs,t)),e.url=t=>e.check(zo(qs,t)),e.jwt=t=>e.check(Ao(pi,t)),e.emoji=t=>e.check(vo(Ys,t)),e.guid=t=>e.check(Ce(On,t)),e.uuid=t=>e.check(ho(ze,t)),e.uuidv4=t=>e.check(_o(ze,t)),e.uuidv6=t=>e.check(go(ze,t)),e.uuidv7=t=>e.check(xo(ze,t)),e.nanoid=t=>e.check(yo(Xs,t)),e.guid=t=>e.check(Ce(On,t)),e.cuid=t=>e.check($o(Hs,t)),e.cuid2=t=>e.check(bo(Qs,t)),e.ulid=t=>e.check(wo(ei,t)),e.base64=t=>e.check(Io(ci,t)),e.base64url=t=>e.check(To(ui,t)),e.xid=t=>e.check(ko(ri,t)),e.ksuid=t=>e.check(Zo(ti,t)),e.ipv4=t=>e.check(Po(oi,t)),e.ipv6=t=>e.check(So(ni,t)),e.cidrv4=t=>e.check(Oo(si,t)),e.cidrv6=t=>e.check(Eo(ii,t)),e.e164=t=>e.check(No(ai,t)),e.datetime=t=>e.check(fn(t)),e.date=t=>e.check(dn(t)),e.time=t=>e.check(mn(t)),e.duration=t=>e.check(hn(t))});function jn(e){return fo(Ks,e)}var v=u("ZodStringFormat",(e,r)=>{z.init(e,r),An.init(e,r)}),Gs=u("ZodEmail",(e,r)=>{$t.init(e,r),v.init(e,r)});var On=u("ZodGUID",(e,r)=>{vt.init(e,r),v.init(e,r)});var ze=u("ZodUUID",(e,r)=>{yt.init(e,r),v.init(e,r)});var qs=u("ZodURL",(e,r)=>{bt.init(e,r),v.init(e,r)});var Ys=u("ZodEmoji",(e,r)=>{wt.init(e,r),v.init(e,r)});var Xs=u("ZodNanoID",(e,r)=>{kt.init(e,r),v.init(e,r)});var Hs=u("ZodCUID",(e,r)=>{Zt.init(e,r),v.init(e,r)});var Qs=u("ZodCUID2",(e,r)=>{Pt.init(e,r),v.init(e,r)});var ei=u("ZodULID",(e,r)=>{St.init(e,r),v.init(e,r)});var ri=u("ZodXID",(e,r)=>{Ot.init(e,r),v.init(e,r)});var ti=u("ZodKSUID",(e,r)=>{Et.init(e,r),v.init(e,r)});var oi=u("ZodIPv4",(e,r)=>{jt.init(e,r),v.init(e,r)});var ni=u("ZodIPv6",(e,r)=>{Ct.init(e,r),v.init(e,r)});var si=u("ZodCIDRv4",(e,r)=>{Rt.init(e,r),v.init(e,r)});var ii=u("ZodCIDRv6",(e,r)=>{Dt.init(e,r),v.init(e,r)});var ci=u("ZodBase64",(e,r)=>{Ft.init(e,r),v.init(e,r)});var ui=u("ZodBase64URL",(e,r)=>{Ut.init(e,r),v.init(e,r)});var ai=u("ZodE164",(e,r)=>{Mt.init(e,r),v.init(e,r)});var pi=u("ZodJWT",(e,r)=>{Jt.init(e,r),v.init(e,r)});var li=u("ZodBoolean",(e,r)=>{Bt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Ko(e,t,o,n)});function Cn(e){return Lo(li,e)}var fi=u("ZodUnknown",(e,r)=>{Vt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>qo(e,t,o,n)});function En(){return Fo(fi)}var di=u("ZodNever",(e,r)=>{Wt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Go(e,t,o,n)});function mi(e){return Uo(di,e)}var hi=u("ZodArray",(e,r)=>{Kt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>en(e,t,o,n),e.element=r.element,ve(e,"ZodArray",{min(t,o){return this.check(G(t,o))},nonempty(t){return this.check(G(1,t))},max(t,o){return this.check(_e(t,o))},length(t,o){return this.check(ge(t,o))},unwrap(){return this.element}})});function Qe(e,r){return Mo(hi,e,r)}var _i=u("ZodObject",(e,r)=>{Yt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>rn(e,t,o,n),g.defineLazy(e,"shape",()=>r.shape),ve(e,"ZodObject",{keyof(){return rr(Object.keys(this._zod.def.shape))},catchall(t){return this.clone({...this._zod.def,catchall:t})},passthrough(){return this.clone({...this._zod.def,catchall:En()})},loose(){return this.clone({...this._zod.def,catchall:En()})},strict(){return this.clone({...this._zod.def,catchall:mi()})},strip(){return this.clone({...this._zod.def,catchall:void 0})},extend(t){return g.extend(this,t)},safeExtend(t){return g.safeExtend(this,t)},merge(t){return g.merge(this,t)},pick(t){return g.pick(this,t)},omit(t){return g.omit(this,t)},partial(...t){return g.partial(Un,this,t[0])},required(...t){return g.required(Mn,this,t[0])}})});function Rn(e,r){let t={type:"object",shape:e??{},...g.normalizeParams(r)};return new _i(t)}var Dn=u("ZodUnion",(e,r)=>{Ne.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>tn(e,t,o,n),e.options=r.options});function er(e,r){return new Dn({type:"union",options:e,...g.normalizeParams(r)})}var gi=u("ZodDiscriminatedUnion",(e,r)=>{Dn.init(e,r),Xt.init(e,r)});function Ln(e,r,t){return new gi({type:"union",options:r,discriminator:e,...g.normalizeParams(t)})}var xi=u("ZodIntersection",(e,r)=>{Ht.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>on(e,t,o,n)});function zi(e,r){return new xi({type:"intersection",left:e,right:r})}var He=u("ZodEnum",(e,r)=>{Qt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(o,n,i)=>Yo(e,o,n,i),e.enum=r.entries,e.options=Object.values(r.entries);let t=new Set(Object.keys(r.entries));e.extract=(o,n)=>{let i={};for(let s of o)if(t.has(s))i[s]=r.entries[s];else throw new Error(`Key ${s} not found in enum`);return new He({...r,checks:[],...g.normalizeParams(n),entries:i})},e.exclude=(o,n)=>{let i={...r.entries};for(let s of o)if(t.has(s))delete i[s];else throw new Error(`Key ${s} not found in enum`);return new He({...r,checks:[],...g.normalizeParams(n),entries:i})}});function rr(e,r){let t=Array.isArray(e)?Object.fromEntries(e.map(o=>[o,o])):e;return new He({type:"enum",entries:t,...g.normalizeParams(r)})}var vi=u("ZodLiteral",(e,r)=>{eo.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Xo(e,t,o,n),e.values=new Set(r.values),Object.defineProperty(e,"value",{get(){if(r.values.length>1)throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");return r.values[0]}})});function Fn(e,r){return new vi({type:"literal",values:Array.isArray(e)?e:[e],...g.normalizeParams(r)})}var yi=u("ZodTransform",(e,r)=>{ro.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Qo(e,t,o,n),e._zod.parse=(t,o)=>{if(o.direction==="backward")throw new J(e.constructor.name);t.addIssue=i=>{if(typeof i=="string")t.issues.push(g.issue(i,t.value,r));else{let s=i;s.fatal&&(s.continue=!1),s.code??(s.code="custom"),s.input??(s.input=t.value),s.inst??(s.inst=e),t.issues.push(g.issue(s))}};let n=r.transform(t.value,t);return n instanceof Promise?n.then(i=>(t.value=i,t.fallback=!0,t)):(t.value=n,t.fallback=!0,t)}});function $i(e){return new yi({type:"transform",transform:e})}var Un=u("ZodOptional",(e,r)=>{Ae.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Xe(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function In(e){return new Un({type:"optional",innerType:e})}var bi=u("ZodExactOptional",(e,r)=>{to.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Xe(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function wi(e){return new bi({type:"optional",innerType:e})}var ki=u("ZodNullable",(e,r)=>{oo.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>nn(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function Tn(e){return new ki({type:"nullable",innerType:e})}var Zi=u("ZodDefault",(e,r)=>{no.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>cn(e,t,o,n),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function Pi(e,r){return new Zi({type:"default",innerType:e,get defaultValue(){return typeof r=="function"?r():g.shallowClone(r)}})}var Si=u("ZodPrefault",(e,r)=>{so.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>un(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function Oi(e,r){return new Si({type:"prefault",innerType:e,get defaultValue(){return typeof r=="function"?r():g.shallowClone(r)}})}var Mn=u("ZodNonOptional",(e,r)=>{io.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>sn(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function Ei(e,r){return new Mn({type:"nonoptional",innerType:e,...g.normalizeParams(r)})}var Ii=u("ZodCatch",(e,r)=>{co.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>an(e,t,o,n),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function Ti(e,r){return new Ii({type:"catch",innerType:e,catchValue:typeof r=="function"?r:()=>r})}var Ni=u("ZodPipe",(e,r)=>{uo.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>pn(e,t,o,n),e.in=r.in,e.out=r.out});function Nn(e,r){return new Ni({type:"pipe",in:e,out:r})}var Ai=u("ZodReadonly",(e,r)=>{ao.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>ln(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function ji(e){return new Ai({type:"readonly",innerType:e})}var Ci=u("ZodCustom",(e,r)=>{po.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Ho(e,t,o,n)});function Ri(e,r={}){return Jo(Ci,e,r)}function Di(e,r){return Bo(e,r)}var na={string:jn,object:Rn,enum:rr,boolean:Cn,union:er,array:Qe,discriminatedUnion:Ln,literal:Fn};;
return na;
})();
// src/contract.ts
var sessionIdSchema = external_exports.string().min(1);
var fileEntrySchema = external_exports.object({
  path: external_exports.string().min(1),
  relative: external_exports.string().min(1),
  kind: external_exports.enum(["file", "dir"])
}).readonly();
var fileIgnoreRuleSchema = external_exports.object({
  kind: external_exports.enum(["exact", "regex"]),
  pattern: external_exports.string().min(1),
  caseSensitive: external_exports.boolean()
}).readonly().superRefine((rule, context) => {
  if (rule.kind !== "regex") return;
  try {
    new RegExp(rule.pattern, rule.caseSensitive ? "" : "i");
  } catch (error51) {
    const message = error51 instanceof Error ? error51.message : "Invalid regular expression";
    context.addIssue({ code: "custom", message });
  }
});
var fileIgnoreRuleInputSchema = external_exports.union([external_exports.string(), fileIgnoreRuleSchema]);
var workspaceIgnoreFilesSchema = external_exports.object({
  workspace: external_exports.string().min(1),
  ignoreFiles: external_exports.array(fileIgnoreRuleInputSchema)
}).readonly();
var atFileSettingsSchema = external_exports.object({
  enabled: external_exports.boolean(),
  ignoreFiles: external_exports.array(fileIgnoreRuleInputSchema),
  workspaceIgnoreFiles: external_exports.array(workspaceIgnoreFilesSchema)
}).readonly();
var atFileSettingsUpdateSchema = external_exports.discriminatedUnion("field", [
  external_exports.object({ field: external_exports.literal("enabled"), value: external_exports.boolean() }).readonly(),
  external_exports.object({ field: external_exports.literal("ignoreFiles"), value: external_exports.array(fileIgnoreRuleInputSchema) }).readonly(),
  external_exports.object({
    field: external_exports.literal("workspaceIgnoreFiles"),
    value: external_exports.array(workspaceIgnoreFilesSchema)
  }).readonly()
]);
var AT_FILE_INVOCATIONS = [
  {
    id: "dsh-at-file#atFile/search",
    service: "atFile",
    namespace: "atFile",
    method: "search",
    invocation: { kind: "direct" },
    parameters: [
      {
        name: "agent",
        wire: "agentId",
        source: "lookup",
        lookup: "agent",
        // The type symbol must equal the agent lookup provider's wire identity
        // exactly — the gateway's strict path rejects a mismatched symbol.
        codec: { mode: "strict", typeSymbol: "@deepseek-ai/dsh-session/types#SessionId", schema: sessionIdSchema }
      }
    ],
    cancellation: { parameter: "signal" },
    result: {
      mode: "strict",
      typeSymbol: "dsh-at-file#FileEntry[]",
      schema: external_exports.array(fileEntrySchema)
    }
  },
  {
    id: "dsh-at-file#atFile/getSettings",
    service: "atFile",
    namespace: "atFile",
    method: "getSettings",
    invocation: { kind: "direct" },
    parameters: [],
    result: {
      mode: "strict",
      typeSymbol: "dsh-at-file#AtFileSettings",
      schema: atFileSettingsSchema
    }
  },
  {
    id: "dsh-at-file#atFile/updateSettings",
    service: "atFile",
    namespace: "atFile",
    method: "updateSettings",
    invocation: { kind: "direct" },
    parameters: [
      {
        name: "update",
        wire: "update",
        source: "json",
        codec: {
          mode: "strict",
          typeSymbol: "dsh-at-file#AtFileSettingsUpdate",
          schema: atFileSettingsUpdateSchema
        }
      }
    ],
    result: {
      mode: "strict",
      typeSymbol: "dsh-at-file#AtFileSettings",
      schema: atFileSettingsSchema
    }
  }
];

// src/typert.ts
var TYPERT_MANIFEST = {
  package: "dsh-at-file",
  face: "host",
  schemas: [],
  model: {
    services: [
      {
        key: "atFile",
        exportName: "AtFileRuntime",
        description: "Workspace path search and durable settings for the @file picker.",
        tags: [],
        members: [
          {
            kind: "method",
            name: "search",
            signature: "search(agent: Agent, signal: AbortSignal): Promise<readonly FileEntry[]>"
          },
          {
            kind: "method",
            name: "getSettings",
            signature: "getSettings(): AtFileSettings"
          },
          {
            kind: "method",
            name: "updateSettings",
            signature: "updateSettings(update: AtFileSettingsUpdate): Promise<AtFileSettings>"
          }
        ],
        types: []
      }
    ],
    events: [],
    objects: []
  },
  invocations: AT_FILE_INVOCATIONS
};

// src/settings.ts
import { settingsNamespace } from "@deepseek-ai/dsh-settings";
var AT_FILE_NAMESPACE = settingsNamespace("at-file");
var AtFileSettingsSchema = Schema.object({
  enabled: Schema.boolean().default(true),
  ignoreFiles: Schema.array(Schema.union([
    Schema.string(),
    Schema.object({
      kind: Schema.union(["exact", "regex"]),
      pattern: Schema.string(),
      caseSensitive: Schema.boolean()
    })
  ])).default([...DEFAULT_IGNORE_FILES]),
  workspaceIgnoreFiles: Schema.array(Schema.object({
    workspace: Schema.string(),
    ignoreFiles: Schema.array(Schema.union([
      Schema.string(),
      Schema.object({
        kind: Schema.union(["exact", "regex"]),
        pattern: Schema.string(),
        caseSensitive: Schema.boolean()
      })
    ]))
  })).default([])
});
function registerAtFileSettings(ctx) {
  return ctx.settings.register(AT_FILE_NAMESPACE, AtFileSettingsSchema, { applies: "live" });
}

// src/mention.ts
import { isAbsolute, relative as pathRelative, resolve as resolve2, sep as sep2 } from "node:path";
import { stat } from "node:fs/promises";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
var USER_SOURCE_KIND = "user";
var MENTION_PATTERN = /@([^\s@]+)/g;
function scanMentions(text) {
  if (!text.includes("@")) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const match of text.matchAll(MENTION_PATTERN)) {
    const raw = match[1];
    const relative2 = raw.endsWith("/") ? raw.slice(0, -1) : raw;
    if (relative2 === "" || seen.has(relative2)) continue;
    seen.add(relative2);
    out.push(relative2);
  }
  return out;
}
async function resolveMention(token, cwd, signal) {
  if (isAbsolute(token)) return void 0;
  const absolute = resolve2(cwd, token);
  const confined = pathRelative(cwd, absolute);
  if (confined === ".." || confined.startsWith(`..${sep2}`) || isAbsolute(confined)) {
    return void 0;
  }
  signal.throwIfAborted();
  const info = await stat(absolute).catch(() => void 0);
  signal.throwIfAborted();
  if (info === void 0) return void 0;
  const relative2 = confined.split(sep2).join("/") || ".";
  return { relative: relative2, kind: info.isDirectory() ? "dir" : "file" };
}
function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function referenceForm(mention) {
  const kind = mention.kind === "dir" ? "directory" : "file";
  return `<workspace-reference path="${escapeAttribute(mention.relative)}" kind="${kind}" />`;
}
async function expandMentions(messages, cwd, signal) {
  if (cwd === void 0 || !isAbsolute(cwd)) return [];
  const tokens = [];
  for (const message of messages) {
    if (message.source.kind !== USER_SOURCE_KIND) continue;
    for (const block of message.content) {
      if (block.type !== "text") continue;
      tokens.push(...scanMentions(block.text));
    }
  }
  const injections = [];
  const results = await Promise.all(tokens.map(async (token) => {
    signal.throwIfAborted();
    const mention = await resolveMention(token, cwd, signal);
    if (mention === void 0) return void 0;
    return createUserMessage({
      content: [{ type: "text", text: referenceForm(mention) }],
      source: { kind: "at-file-mention", relative: mention.relative }
    });
  }));
  for (const result of results) {
    if (result !== void 0) injections.push(result);
  }
  return injections;
}
async function mentionPreStep(agent, isEnabled, messages, signal, next) {
  const decision = await next();
  if (decision.kind === "reject") return decision;
  if (!isEnabled()) return decision;
  const injections = await expandMentions(messages, agent.session.header.cwd, signal);
  if (injections.length === 0) return decision;
  return { kind: "enter", messages: [...decision.messages, ...injections] };
}

// src/index.ts
var name = "dsh-at-file";
var inject = ["typert", "settings", "agents"];
var Config = Schema.object({
  maxIndexedFiles: Schema.natural().min(1).default(5e3),
  ignoreDirs: Schema.array(Schema.string()).default([...DEFAULT_IGNORE_DIRS])
});
function apply(ctx, config2) {
  const resolved = Config(config2 ?? {});
  const settings = registerAtFileSettings(ctx);
  const readSettings = () => settings.get();
  const writeSettings = async (update) => {
    if (update.field === "enabled") {
      await settings.update({ enabled: update.value });
    } else if (update.field === "ignoreFiles") {
      await settings.update({ ignoreFiles: normalizeIgnoreFiles(update.value) });
    } else {
      await settings.update({
        workspaceIgnoreFiles: normalizeWorkspaceIgnoreFiles(update.value)
      });
    }
    return settings.get();
  };
  new AtFileRuntime(ctx, resolved, readSettings, writeSettings);
  ctx.effect(() => {
    const dispose = ctx.typert.register(TYPERT_MANIFEST);
    return () => {
      void dispose();
    };
  }, "dsh-at-file: typert manifest");
  ctx.on("agent/created", ({ agent }) => {
    agent.ctx.effect(() => {
      const stop = agent.ctx.on("agent/pre-step", async ({ messages, signal }, next) => {
        return mentionPreStep(agent, () => settings.get().enabled, messages, signal, next);
      });
      return () => {
        stop();
      };
    }, "dsh-at-file: pre-step path references");
  });
}
export {
  Config,
  DEFAULT_IGNORE_DIRS,
  DEFAULT_IGNORE_FILES,
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
