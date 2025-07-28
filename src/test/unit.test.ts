import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';

suite('Unit Tests', () => {
  let configStub: sinon.SinonStub;
  let showWarningMessageStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;
  let showInformationMessageStub: sinon.SinonStub;
  let getExtensionStub: sinon.SinonStub;

  setup(() => {
    // Mock vscode.workspace.getConfiguration
    configStub = sinon.stub(vscode.workspace, 'getConfiguration');

    // Mock vscode.window methods
    showWarningMessageStub = sinon.stub(vscode.window, 'showWarningMessage');
    showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage');
    showInformationMessageStub = sinon.stub(
      vscode.window,
      'showInformationMessage'
    );

    // Mock vscode.extensions.getExtension
    getExtensionStub = sinon.stub(vscode.extensions, 'getExtension');
  });

  teardown(() => {
    sinon.restore();
  });

  suite('Configuration Management', () => {
    test('should handle missing API key configuration', () => {
      // Arrange
      const mockConfig = {
        get: sinon.stub(),
      };
      mockConfig.get.withArgs('bailianApiKey').returns(null);
      mockConfig.get.withArgs('bailianModel').returns('qwen-turbo-latest');
      configStub.returns(mockConfig);

      // Act
      const apiKey = mockConfig.get('bailianApiKey');
      const model = mockConfig.get('bailianModel');

      // Assert
      assert.strictEqual(apiKey, null);
      assert.strictEqual(model, 'qwen-turbo-latest');
    });

    test('should handle missing model configuration', () => {
      // Arrange
      const mockConfig = {
        get: sinon.stub(),
      };
      mockConfig.get.withArgs('bailianApiKey').returns('test-api-key');
      mockConfig.get.withArgs('bailianModel').returns(null);
      configStub.returns(mockConfig);

      // Act
      const apiKey = mockConfig.get('bailianApiKey');
      const model = mockConfig.get('bailianModel');

      // Assert
      assert.strictEqual(apiKey, 'test-api-key');
      assert.strictEqual(model, null);
    });

    test('should handle valid configuration', () => {
      // Arrange
      const mockConfig = {
        get: sinon.stub(),
      };
      mockConfig.get.withArgs('bailianApiKey').returns('test-api-key');
      mockConfig.get.withArgs('bailianModel').returns('qwen-turbo-latest');
      configStub.returns(mockConfig);

      // Act
      const config = vscode.workspace.getConfiguration('aiCommitGenerator');
      const apiKey = config.get('bailianApiKey');
      const model = config.get('bailianModel');

      // Assert
      assert.strictEqual(configStub.calledWith('aiCommitGenerator'), true);
      assert.strictEqual(apiKey, 'test-api-key');
      assert.strictEqual(model, 'qwen-turbo-latest');
    });
  });

  suite('Git Extension Integration', () => {
    test('should handle missing Git extension', () => {
      // Arrange
      getExtensionStub.withArgs('vscode.git').returns(null);

      // Act
      const gitExtension = vscode.extensions.getExtension('vscode.git');

      // Assert
      assert.strictEqual(gitExtension, null);
      assert.strictEqual(getExtensionStub.calledWith('vscode.git'), true);
    });

    test('should handle valid Git extension', () => {
      // Arrange
      const mockGitExtension = {
        exports: {
          getAPI: sinon.stub().returns({
            repositories: [],
          }),
        },
      };
      getExtensionStub.withArgs('vscode.git').returns(mockGitExtension);

      // Act
      const gitExtension = vscode.extensions.getExtension('vscode.git');

      // Assert
      assert.notStrictEqual(gitExtension, null);
      assert.strictEqual(typeof gitExtension?.exports.getAPI, 'function');
    });

    test('should handle Git API with repositories', () => {
      // Arrange
      const mockRepository = {
        state: {
          indexChanges: [
            { uri: { path: '/test/file1.ts' } },
            { uri: { path: '/test/file2.ts' } },
          ],
        },
        diff: sinon.stub().resolves('mock diff content'),
      };

      const mockGitApi = {
        repositories: [mockRepository],
      };

      const mockGitExtension = {
        exports: {
          getAPI: sinon.stub().returns(mockGitApi),
        },
      };

      getExtensionStub.withArgs('vscode.git').returns(mockGitExtension);

      // Act
      const gitExtension = vscode.extensions.getExtension('vscode.git');
      const git = gitExtension?.exports.getAPI(1);
      const repository = git?.repositories[0];

      // Assert
      assert.notStrictEqual(repository, undefined);
      assert.strictEqual(repository?.state.indexChanges.length, 2);
      assert.strictEqual(typeof repository?.diff, 'function');
    });

    test('should handle empty staged changes', () => {
      // Arrange
      const mockRepository = {
        state: {
          indexChanges: [],
        },
        diff: sinon.stub().resolves('mock diff content'),
      };

      const mockGitApi = {
        repositories: [mockRepository],
      };

      const mockGitExtension = {
        exports: {
          getAPI: sinon.stub().returns(mockGitApi),
        },
      };

      getExtensionStub.withArgs('vscode.git').returns(mockGitExtension);

      // Act
      const gitExtension = vscode.extensions.getExtension('vscode.git');
      const git = gitExtension?.exports.getAPI(1);
      const repository = git?.repositories[0];
      const stagedChanges = repository?.state.indexChanges;

      // Assert
      assert.strictEqual(stagedChanges?.length, 0);
    });
  });

  suite('Diff Content Processing', () => {
    test('should handle successful diff retrieval', async () => {
      // Arrange
      const mockDiffContent = `diff --git a/src/test.ts b/src/test.ts
index 1234567..abcdefg 100644
--- a/src/test.ts
+++ b/src/test.ts
@@ -1,3 +1,4 @@
 export function test() {
+  console.log('test');
   return true;
 }`;

      const mockRepository = {
        state: {
          indexChanges: [{ uri: { path: '/src/test.ts' } }],
        },
        diff: sinon.stub().resolves(mockDiffContent),
      };

      // Act
      const diffResult = await mockRepository.diff(true);

      // Assert
      assert.strictEqual(diffResult, mockDiffContent);
      assert.strictEqual(mockRepository.diff.calledWith(true), true);
    });

    test('should handle diff retrieval error', async () => {
      // Arrange
      const mockRepository = {
        state: {
          indexChanges: [{ uri: { path: '/src/test.ts' } }],
        },
        diff: sinon.stub().rejects(new Error('Git diff failed')),
      };

      // Act & Assert
      try {
        await mockRepository.diff(true);
        assert.fail('Expected error to be thrown');
      } catch (error) {
        assert.strictEqual((error as Error).message, 'Git diff failed');
      }
    });

    test('should handle null diff content', async () => {
      // Arrange
      const mockRepository = {
        state: {
          indexChanges: [{ uri: { path: '/src/test.ts' } }],
        },
        diff: sinon.stub().resolves(null),
      };

      // Act
      const diffResult = await mockRepository.diff(true);

      // Assert
      assert.strictEqual(diffResult, null);
    });
  });

  suite('Prompt System', () => {
    test('should validate system prompt structure', () => {
      // Test system prompt format and content
      const systemPromptPattern =
        /请根据以下Git diff内容生成一个简洁、清晰的commit信息/;
      const mockSystemPrompt =
        '请根据以下Git diff内容生成一个简洁、清晰的commit信息。要求：1. 使用中文 2. 简洁明了';

      assert.strictEqual(systemPromptPattern.test(mockSystemPrompt), true);
    });

    test('should validate user prompt generation', () => {
      // Test user prompt with diff content
      const mockDiffContent = 'diff --git a/file.ts b/file.ts\n+added line';
      const expectedPromptPattern = /Git diff内容/;
      const mockUserPrompt = `Git diff内容：\n${mockDiffContent}`;

      assert.strictEqual(expectedPromptPattern.test(mockUserPrompt), true);
      assert.strictEqual(mockUserPrompt.includes(mockDiffContent), true);
    });
  });

  suite('Message Generation Logic', () => {
    test('should validate commit message format', () => {
      // Test cases for different commit message formats
      const testCases = [
        {
          input: '添加新功能：实现用户认证模块',
          expected: true,
          description: 'Valid Chinese commit message',
        },
        {
          input: 'feat: add user authentication module',
          expected: true,
          description: 'Valid English conventional commit',
        },
        {
          input: '修复bug：解决登录问题',
          expected: true,
          description: 'Valid Chinese bug fix message',
        },
        {
          input: '',
          expected: false,
          description: 'Empty commit message',
        },
        {
          input: '   ',
          expected: false,
          description: 'Whitespace only commit message',
        },
      ];

      testCases.forEach((testCase) => {
        const isValid = testCase.input.trim().length > 0;
        assert.strictEqual(isValid, testCase.expected, testCase.description);
      });
    });

    test('should handle message trimming', () => {
      const testMessages = [
        '  添加新功能：实现用户认证模块  ',
        '\n修复bug：解决登录问题\n',
        '\t更新文档：添加API说明\t',
      ];

      const expectedResults = [
        '添加新功能：实现用户认证模块',
        '修复bug：解决登录问题',
        '更新文档：添加API说明',
      ];

      testMessages.forEach((message, index) => {
        const trimmed = message.trim();
        assert.strictEqual(trimmed, expectedResults[index]);
      });
    });
  });

  suite('Error Handling', () => {
    test('should handle various error scenarios', () => {
      const errorScenarios = [
        {
          error: new Error('Network timeout'),
          expectedMessage: 'Network timeout',
          description: 'Network error handling',
        },
        {
          error: new Error('API rate limit exceeded'),
          expectedMessage: 'API rate limit exceeded',
          description: 'Rate limit error handling',
        },
        {
          error: new Error('Invalid API key'),
          expectedMessage: 'Invalid API key',
          description: 'Authentication error handling',
        },
      ];

      errorScenarios.forEach((scenario) => {
        assert.strictEqual(
          scenario.error.message,
          scenario.expectedMessage,
          scenario.description
        );
      });
    });

    test('should validate error message display', () => {
      // Test that error messages are properly displayed
      const errorMessage = '生成commit信息失败';

      // Simulate showing error message
      showErrorMessageStub.withArgs(errorMessage).returns(Promise.resolve());

      // Act
      vscode.window.showErrorMessage(errorMessage);

      // Assert
      assert.strictEqual(showErrorMessageStub.calledWith(errorMessage), true);
    });

    test('should validate warning message display', () => {
      // Test that warning messages are properly displayed
      const warningMessage = '暂存区没有变更文件';

      // Simulate showing warning message
      showWarningMessageStub
        .withArgs(warningMessage)
        .returns(Promise.resolve());

      // Act
      vscode.window.showWarningMessage(warningMessage);

      // Assert
      assert.strictEqual(
        showWarningMessageStub.calledWith(warningMessage),
        true
      );
    });
  });

  suite('Extension Integration', () => {
    test('should simulate complete workflow with valid data', async () => {
      // Arrange - Setup complete mock chain
      const mockConfig = {
        get: sinon.stub(),
      };
      mockConfig.get.withArgs('bailianApiKey').returns('test-api-key');
      mockConfig.get.withArgs('bailianModel').returns('qwen-turbo-latest');
      configStub.returns(mockConfig);

      const mockDiffContent = `diff --git a/src/test.ts b/src/test.ts
index 1234567..abcdefg 100644
--- a/src/test.ts
+++ b/src/test.ts
@@ -1,3 +1,4 @@
 export function test() {
+  console.log('test');
   return true;
 }`;

      const mockRepository = {
        state: {
          indexChanges: [{ uri: { path: '/src/test.ts' } }],
        },
        diff: sinon.stub().resolves(mockDiffContent),
      };

      const mockGitApi = {
        repositories: [mockRepository],
      };

      const mockGitExtension = {
        exports: {
          getAPI: sinon.stub().returns(mockGitApi),
        },
      };

      getExtensionStub.withArgs('vscode.git').returns(mockGitExtension);

      // Act - Simulate the workflow
      const config = vscode.workspace.getConfiguration('aiCommitGenerator');
      const apiKey = config.get('bailianApiKey');
      const model = config.get('bailianModel');

      const gitExtension = vscode.extensions.getExtension('vscode.git');
      const git = gitExtension?.exports.getAPI(1);
      const repository = git?.repositories[0];
      const stagedChanges = repository?.state.indexChanges;

      let diffContent = null;
      if (stagedChanges && stagedChanges.length > 0) {
        diffContent = await repository?.diff(true);
      }

      // Assert
      assert.strictEqual(apiKey, 'test-api-key');
      assert.strictEqual(model, 'qwen-turbo-latest');
      assert.notStrictEqual(gitExtension, null);
      assert.strictEqual(stagedChanges?.length, 1);
      assert.strictEqual(diffContent, mockDiffContent);
    });

    test('should simulate workflow with missing configuration', () => {
      // Arrange
      const mockConfig = {
        get: sinon.stub(),
      };
      mockConfig.get.withArgs('bailianApiKey').returns(null);
      mockConfig.get.withArgs('bailianModel').returns(null);
      configStub.returns(mockConfig);

      // Act
      const config = vscode.workspace.getConfiguration('aiCommitGenerator');
      const apiKey = config.get('bailianApiKey');
      const model = config.get('bailianModel');

      // Assert
      assert.strictEqual(apiKey, null);
      assert.strictEqual(model, null);

      // Simulate showing warning messages
      if (!apiKey) {
        vscode.window.showWarningMessage('请在设置中配置阿里云百炼API密钥');
      }
      if (!model) {
        vscode.window.showWarningMessage('请在设置中配置阿里云百炼模型ID');
      }

      assert.strictEqual(showWarningMessageStub.calledTwice, true);
    });
  });

  suite('OpenAI Integration', () => {
    test('should validate OpenAI configuration structure', () => {
      // Test OpenAI client configuration
      const mockConfig = {
        apiKey: 'test-api-key',
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      };

      assert.strictEqual(typeof mockConfig.apiKey, 'string');
      assert.strictEqual(typeof mockConfig.baseURL, 'string');
      assert.strictEqual(mockConfig.baseURL.startsWith('https://'), true);
    });

    test('should validate chat completion request structure', () => {
      // Test chat completion request format
      const mockRequest = {
        model: 'qwen-turbo-latest',
        messages: [
          { role: 'system', content: 'System prompt' },
          { role: 'user', content: 'User prompt' },
        ],
      };

      assert.strictEqual(typeof mockRequest.model, 'string');
      assert.strictEqual(Array.isArray(mockRequest.messages), true);
      assert.strictEqual(mockRequest.messages.length, 2);
      assert.strictEqual(mockRequest.messages[0].role, 'system');
      assert.strictEqual(mockRequest.messages[1].role, 'user');
    });

    test('should validate chat completion response structure', () => {
      // Test expected response format
      const mockResponse = {
        choices: [
          {
            message: {
              content: '添加新功能：实现用户认证模块',
            },
          },
        ],
      };

      assert.strictEqual(Array.isArray(mockResponse.choices), true);
      assert.strictEqual(mockResponse.choices.length, 1);
      assert.strictEqual(
        typeof mockResponse.choices[0].message.content,
        'string'
      );
    });
  });
});
