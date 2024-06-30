import setInfoBoxContent from '@/composables/setInfoBoxContent.js'
import { describe, test, expect } from 'vitest';

describe('setInfoBoxContent with video links', () => {
    // ===================================================================================
    test('should handle valid YouTube link in standard format', () => {
      const input = [
        {
          title: 'Sensory Experience',
          content: 'No information available',
          video: 'https://www.youtube.com/watch?v=S7h8_jYLcSg',
        },
      ];
      const result = setInfoBoxContent(input);
      expect(result[0].video).toEqual('https://www.youtube.com/watch?v=S7h8_jYLcSg');
      expect(result[0].video_embed).toBe(true);
    });
  
    // ===================================================================================
    test('should handle valid YouTube link in shortened format', () => {
      const input = [
        {
          title: 'Wayfinding',
          content: 'No information available',
          video: 'https://youtu.be/S7h8_jYLcSg',
        },
      ];
      const result = setInfoBoxContent(input);
      expect(result[0].video).toEqual('https://youtu.be/S7h8_jYLcSg');
      expect(result[0].video_embed).toBe(true);
    });
  
    // ===================================================================================
    test('should not display video for invalid YouTube link', () => {
      const input = [
        {
          title: 'Physical Access',
          content: 'No information available',
          video: 'https://example.com/video.mp4',
        },
      ];
      const result = setInfoBoxContent(input);
      expect(result[0].video).toBeUndefined();
      expect(result[0].video_embed).toBe(false);
    });
  
    // ===================================================================================
    test('should not display video for non-YouTube link', () => {
      const input = [
        {
          title: 'General Information',
          content: 'No information available',
          video: 'https://vimeo.com/123456789',
        },
      ];
      const result = setInfoBoxContent(input);
      expect(result[0].video).toBeUndefined();
      expect(result[0].video_embed).toBe(false);
    });
  });