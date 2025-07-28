import * as vscode from 'vscode';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { getUserPrompt, systemPrompt } from './prompts';

export class CommitGenerator {
  private chatModel: OpenAI | null = null;
  private model: string | null = null;
  private apiKey: string | null = null;
  private baseUrl: string = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
  private initMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
  ];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // 从配置中获取API密钥
      const config = vscode.workspace.getConfiguration('aiCommitGenerator');

      this.model = config.get<string>('bailianModel') || null;
      this.apiKey = config.get<string>('bailianApiKey') || null;

      if (!this.apiKey) {
        vscode.window.showWarningMessage('请在设置中配置阿里云百炼API密钥');
        return;
      }

      if (!this.model) {
        vscode.window.showWarningMessage('请在设置中配置阿里云百炼模型ID');
        return;
      }

      this.chatModel = await this.initialOpenAi(this.apiKey, this.baseUrl);
    } catch (error) {
      console.error('初始化AI模型失败:', error);
      vscode.window.showErrorMessage('初始化AI模型失败');
    }
  }

  private async initialOpenAi(apiKey: string, baseUrl: string) {
    // 从配置中获取API密钥
    const openai = new OpenAI({
      // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
      apiKey,
      baseURL: baseUrl,
    });
    return openai;
  }

  async generateCommitMessage(): Promise<string | null> {
    console.log('generate', this.chatModel);
    if (!this.chatModel) {
      vscode.window.showErrorMessage('AI模型未初始化，请检查配置');
      return null;
    }

    try {
      // 获取Git扩展
      const gitExtension = vscode.extensions.getExtension('vscode.git');
      if (!gitExtension) {
        vscode.window.showErrorMessage('Git扩展未找到');
        return null;
      }

      const git = gitExtension.exports.getAPI(1);
      const repository = git.repositories[0];

      if (!repository) {
        vscode.window.showErrorMessage('未找到Git仓库');
        return null;
      }

      // 获取暂存区的变更
      const stagedChanges = repository.state.indexChanges;

      if (stagedChanges.length === 0) {
        vscode.window.showWarningMessage('暂存区没有变更文件');
        return null;
      }

      // 获取diff内容
      const diffContent = await this.getStagedDiff(repository);

      if (!diffContent) {
        vscode.window.showWarningMessage('无法获取diff内容');
        return null;
      }

      if (!this.model) {
        vscode.window.showWarningMessage('请在设置中配置阿里云百炼模型ID');
        return null;
      }

      // 生成commit信息
      // const prompt = this.createPrompt(diffContent);
      const prompt = getUserPrompt(diffContent);
      const messages = [...this.initMessages];
      messages.push({ role: 'user', content: prompt });
      const response = await this.chatModel.chat.completions.create({
        model: this.model,
        messages,
      });

      // vscode.window.showInformationMessage(
      //   `生成commit信息: ${response.choices[0].message.content?.trim()}`
      // );

      return response.choices[0].message.content?.trim() || null;
    } catch (error) {
      console.error('生成commit信息失败:', error);
      vscode.window.showErrorMessage('生成commit信息失败');
      return null;
    }
  }

  private async getStagedDiff(repository: any): Promise<string | null> {
    try {
      // 执行git diff --cached命令获取暂存区diff
      const diffResult = await repository.diff(true);
      return diffResult;
    } catch (error) {
      console.error('获取diff失败:', error);
      return null;
    }
  }

  // private createPrompt(diffContent: string): string {
  //   return `请根据以下Git diff内容生成一个简洁、清晰的commit信息。

  //         要求：
  //         1. 使用中文
  //         2. 简洁明了，不超过50个字符
  //         3. 采用动词开头，如"添加"、"修复"、"更新"、"删除"等
  //         4. 突出主要变更内容
  //         5. 不要包含文件路径或技术细节

  //         Git diff内容：
  //         ${diffContent}

  //         请直接返回commit信息，不要包含其他解释：`;
  // }
}
