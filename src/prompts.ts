// export const systemPrompt: string = """""";
export const systemPrompt: string = `
请生成一个符合规范的中文Git提交信息。

**格式要求：**
<type>(<scope>): <subject>

<body>

<footer>

**必填部分：**
- Header（标题行）：\`<type>(<scope>): <subject>\` 格式，必须包含
- Body和Footer为可选部分

**字符限制：**
- 每行不超过72个字符（最多100个字符）
- 总行数必须控制在3行以内

**Type类型（必须选择其中一个）：**
- \`feat\`: 新功能
- \`fix\`: 修复bug
- \`docs\`: 文档更新
- \`style\`: 代码格式化（不影响代码执行的更改）
- \`refactor\`: 重构（既不是新功能也不是bug修复的代码更改）
- \`test\': 添加测试
- \`chore\`: 构建过程或辅助工具的更改

**内容要求：**
1. 使用简体中文
2. Subject行要准确、简洁地总结变更要点
3. 如果需要Body部分，应提供详细说明，可分多行
4. 当内容超过3行时，必须重新总结并简化描述
5. 每个提交信息只能包含一个type类型
6. 响应内容只包含提交信息，不包含其他解释文字
7. 在模板中保留空行格式

**Body部分示例格式：**

更详细的解释文字（如有必要）。每行约72个字符。

进一步的段落在空行后继续。

- 也可以使用项目符号
- 使用悬挂缩进
- 总commit内容必须不能超过5行内容
`;

// export const systemPrompt: string = `
// Now, please generate a commit message with Chinese.
// Make sure it includes an accurate and informative subject line that succinctly summarizes the key points of the changes, the response must only have commit message content and must have blank line in message template.

// Below is the commit message template:

// <type>(<scope>): <subject>

// <body>

// <footer>

// The Header is mandatory, while the Body and Footer are optional.

// Regardless of which part, no line should exceed 72 characters (or 100 characters). This is to avoid automatic line breaks affecting aesthetics.

// Below is the type Enum:

// - feat: new feature
// - fix: bug fix
// - docs: documentation
// - style: formatting (changes that do not affect code execution)
// - refactor: refactoring (code changes that are neither new features nor bug fixes)
// - test: adding tests
// - chore: changes to the build process or auxiliary tools

// The body section is a detailed description of this commit and can be split into multiple lines. Here's an example:

// More detailed explanatory text, if necessary. Wrap it to about 72 characters or so.

// Further paragraphs come after blank lines.

// - Bullet points are okay, too
// - Use a hanging indent

// 当提交内容生产的额外内容超过了3行之后，请对所有内容进行总结，重新综合所有内容再生成一条新的内容，简略描述下改动内容即可。

// 总行数务必控制在3行以内！

// 注意：
// 一个提交信息中只能包含有且仅有一个type Enum
// ```;

export const getUserPrompt = (diff: string): string => `
请你生成一段commit信息，尽可能简洁一些，内容不要太多。但必须使用中文来进行生成。
改动内容如下：
"${diff}"
`;
