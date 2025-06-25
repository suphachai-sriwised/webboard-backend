import { UpdatePostDto } from './update-post.dto';

describe('UpdatePostDto', () => {
  it('should be defined', () => {
    expect(UpdatePostDto).toBeDefined();
  });

  it('should create an instance with all fields optional', () => {
    const dto = new UpdatePostDto();

    expect(dto.topic).toBeUndefined();
    expect(dto.content).toBeUndefined();
    expect(dto.community).toBeUndefined();
    expect(dto.username).toBeUndefined();
  });

  it('should allow setting individual fields', () => {
    const dto = new UpdatePostDto();
    dto.topic = 'Updated Topic';

    expect(dto.topic).toBe('Updated Topic');
    expect(dto.content).toBeUndefined();
    expect(dto.community).toBeUndefined();
    expect(dto.username).toBeUndefined();
  });

  it('should allow setting all fields', () => {
    const dto = new UpdatePostDto();
    dto.topic = 'Updated Topic';
    dto.content = 'Updated Content';
    dto.community = 'Updated Community';
    dto.username = 'updateduser';

    expect(dto.topic).toBe('Updated Topic');
    expect(dto.content).toBe('Updated Content');
    expect(dto.community).toBe('Updated Community');
    expect(dto.username).toBe('updateduser');
  });

  it('should allow partial updates', () => {
    const dto = new UpdatePostDto();
    dto.topic = 'Only Topic Updated';
    dto.content = 'Only Content Updated';

    expect(dto.topic).toBe('Only Topic Updated');
    expect(dto.content).toBe('Only Content Updated');
    expect(dto.community).toBeUndefined();
    expect(dto.username).toBeUndefined();
  });

  it('should handle empty strings', () => {
    const dto = new UpdatePostDto();
    dto.topic = '';
    dto.content = '';

    expect(dto.topic).toBe('');
    expect(dto.content).toBe('');
  });

  it('should handle null values', () => {
    const dto = new UpdatePostDto();
    dto.topic = null as any;
    dto.content = null as any;

    expect(dto.topic).toBeNull();
    expect(dto.content).toBeNull();
  });

  it('should inherit from CreatePostDto via PartialType', () => {
    const dto = new UpdatePostDto();
    
    // Test that it can be set like CreatePostDto but all optional
    expect(dto.topic).toBeUndefined();
    expect(dto.content).toBeUndefined();
    expect(dto.community).toBeUndefined();
    expect(dto.username).toBeUndefined();

    // But can be set
    dto.topic = 'Test';
    expect(dto.topic).toBe('Test');
  });
});
