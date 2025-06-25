import { UpdateCommentDto } from './update-comment.dto';

describe('UpdateCommentDto', () => {
  it('should be defined', () => {
    expect(UpdateCommentDto).toBeDefined();
  });

  it('should create an instance with all fields optional', () => {
    const dto = new UpdateCommentDto();

    expect(dto.comment).toBeUndefined();
    expect(dto.username).toBeUndefined();
  });

  it('should allow setting individual fields', () => {
    const dto = new UpdateCommentDto();
    dto.comment = 'Updated Comment';

    expect(dto.comment).toBe('Updated Comment');
    expect(dto.username).toBeUndefined();
  });

  it('should allow setting username only', () => {
    const dto = new UpdateCommentDto();
    dto.username = 'updateduser';

    expect(dto.comment).toBeUndefined();
    expect(dto.username).toBe('updateduser');
  });

  it('should allow setting all fields', () => {
    const dto = new UpdateCommentDto();
    dto.comment = 'Updated Comment';
    dto.username = 'updateduser';

    expect(dto.comment).toBe('Updated Comment');
    expect(dto.username).toBe('updateduser');
  });

  it('should handle empty strings', () => {
    const dto = new UpdateCommentDto();
    dto.comment = '';
    dto.username = '';

    expect(dto.comment).toBe('');
    expect(dto.username).toBe('');
  });

  it('should handle null values', () => {
    const dto = new UpdateCommentDto();
    dto.comment = null as any;
    dto.username = null as any;

    expect(dto.comment).toBeNull();
    expect(dto.username).toBeNull();
  });

  it('should handle long comment updates', () => {
    const dto = new UpdateCommentDto();
    const longComment = 'Updated: ' + 'A'.repeat(5000);
    dto.comment = longComment;

    expect(dto.comment).toBe(longComment);
    expect(dto.comment.length).toBe(5009);
  });

  it('should handle multiline comment updates', () => {
    const dto = new UpdateCommentDto();
    dto.comment = 'Updated Line 1\nUpdated Line 2\nUpdated Line 3';

    expect(dto.comment).toContain('\n');
    expect(dto.comment.split('\n')).toHaveLength(3);
    expect(dto.comment.split('\n')[0]).toBe('Updated Line 1');
  });

  it('should inherit from CreateCommentDto via PartialType', () => {
    const dto = new UpdateCommentDto();
    
    // Test that it can be set like CreateCommentDto but all optional
    expect(dto.comment).toBeUndefined();
    expect(dto.username).toBeUndefined();

    // But can be set
    dto.comment = 'Test Comment';
    dto.username = 'testuser';
    expect(dto.comment).toBe('Test Comment');
    expect(dto.username).toBe('testuser');
  });
});
