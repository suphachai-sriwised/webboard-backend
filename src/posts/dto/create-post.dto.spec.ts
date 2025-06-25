import { CreatePostDto } from './create-post.dto';

describe('CreatePostDto', () => {
  it('should be defined', () => {
    expect(CreatePostDto).toBeDefined();
  });

  it('should create an instance with all required fields', () => {
    const dto = new CreatePostDto();
    dto.topic = 'Test Topic';
    dto.content = 'Test Content';
    dto.community = 'Test Community';
    dto.username = 'testuser';

    expect(dto.topic).toBe('Test Topic');
    expect(dto.content).toBe('Test Content');
    expect(dto.community).toBe('Test Community');
    expect(dto.username).toBe('testuser');
  });

  it('should allow empty strings for fields', () => {
    const dto = new CreatePostDto();
    dto.topic = '';
    dto.content = '';
    dto.community = '';
    dto.username = '';

    expect(dto.topic).toBe('');
    expect(dto.content).toBe('');
    expect(dto.community).toBe('');
    expect(dto.username).toBe('');
  });

  it('should handle long content', () => {
    const dto = new CreatePostDto();
    const longContent = 'A'.repeat(10000);
    dto.content = longContent;

    expect(dto.content).toBe(longContent);
    expect(dto.content.length).toBe(10000);
  });

  it('should handle special characters', () => {
    const dto = new CreatePostDto();
    dto.topic = 'Test Topic with émojis 🚀 and special chars !@#$%';
    dto.content = 'Content with\nnewlines\nand\ttabs';
    dto.community = 'Community-Name_123';
    dto.username = 'user.name@test';

    expect(dto.topic).toContain('émojis 🚀');
    expect(dto.content).toContain('\n');
    expect(dto.content).toContain('\t');
    expect(dto.community).toBe('Community-Name_123');
    expect(dto.username).toBe('user.name@test');
  });
});
