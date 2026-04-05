// createComponent.js
const fs = require("fs");
const path = require("path");

function tsxTemplate(name) {
  return `import { View, Text } from 'react-native'
import React from 'react'
import styles from "./${name}.style"

interface ${name}Props {}

const ${name}: React.FC<${name}Props> = () => {
  return (
    <View>
      <Text>${name}</Text>
    </View>
  )
}

export default ${name}
`;
}

function styleTemplate() {
  return `import { StyleSheet } from "react-native";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { wScale, hScale } from "../../styles/Scaler";

export default StyleSheet.create({})
`;
}

function indexTemplate(name) {
  return `export { default } from "./${name}"`
}

let name = process.argv[2];
if (!name) {
  console.error("Kullanım: node createComponent.js <BilesenAdi>");
  process.exit(1);
}

if (name.startsWith("0")) {
  name = name.slice(1);
} else {
  name = name.charAt(0).toUpperCase() + name.slice(1);
}

const base_path = "./";
const src_path = path.join(base_path, "src");
const components_path = path.join(src_path, "components");
const new_component_path = path.join(components_path, name);
const new_tsx_path = path.join(new_component_path, `${name}.tsx`);
const new_style_path = path.join(new_component_path, `${name}.style.ts`);
const index_path = path.join(new_component_path, "index.ts");

function create(name) {
  fs.mkdirSync(new_component_path, { recursive: true });

  fs.writeFileSync(new_tsx_path, tsxTemplate(name), { encoding: "utf8" });
  fs.writeFileSync(new_style_path, styleTemplate(), { encoding: "utf8" });
  fs.writeFileSync(index_path, indexTemplate(name), { encoding: "utf8" });
}

if (fs.existsSync(src_path)) {
  if (fs.existsSync(components_path)) {
    create(name);
  } else {
    fs.mkdirSync(components_path);
    create(name);
  }
} else {
  fs.mkdirSync(src_path);
  // Python sürümündeki gibi: burada sadece src oluşturuluyor, component oluşturulmuyor.
}