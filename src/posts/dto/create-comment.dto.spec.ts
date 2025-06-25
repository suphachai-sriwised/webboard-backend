import { CreateCommentDto } from './create-comment.dto';

describe('CreateCommentDto', () => {
  it('should be defined', () => {
    expect(CreateCommentDto).toBeDefined();
  });

  it('should create an instance with all required fields', () => {
    const dto = new CreateCommentDto();
    dto.comment = 'Test Comment';
    dto.username = 'testuser';

    expect(dto.comment).toBe('Test Comment');
    expect(dto.username).toBe('testuser');
  });

  it('should allow empty strings for fields', () => {
    const dto = new CreateCommentDto();
    dto.comment = '';
    dto.username = '';

    expect(dto.comment).toBe('');
    expect(dto.username).toBe('');
  });

  it('should handle long comments', () => {
    const dto = new CreateCommentDto();
    const longComment = 'A'.repeat(5000);
    dto.comment = longComment;

    expect(dto.comment).toBe(longComment);
    expect(dto.comment.length).toBe(5000);
  });

  it('should handle multiline comments', () => {
    const dto = new CreateCommentDto();
    dto.comment = 'Line 1\nLine 2\nLine 3';

    expect(dto.comment).toContain('\n');
    expect(dto.comment.split('\n')).toHaveLength(3);
  });

  it('should handle special characters in comments', () => {
    const dto = new CreateCommentDto();
    dto.comment = 'Comment with émojis 🎉 and special chars !@#$%^&*()';
    dto.username = 'user.name@domain.com';

    expect(dto.comment).toContain('émojis 🎉');
    expect(dto.comment).toContain('!@#$%^&*()');
    expect(dto.username).toBe('user.name@domain.com');
  });

  it('should handle HTML content in comments', () => {
    const dto = new CreateCommentDto();
    dto.comment = '<p>HTML content</p><script>alert("test")</script>';

    expect(dto.comment).toContain('<p>HTML content</p>');
    expect(dto.comment).toContain('<script>');
  });
});
