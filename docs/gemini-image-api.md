# Gemini Image Generation API Reference

Local documentation for using Google's Gemini image generation capabilities in the Instagram automation workflow.

## Models

| Model | ID | Best For | Cost/Image |
|-------|-----|----------|------------|
| Flash | `gemini-2.0-flash-preview-image-generation` | Speed, high volume | ~$0.039 |
| **Pro** | `gemini-3-pro-image-preview` | Quality, reference images | ~$0.06 |

## API Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent
```

**Headers:**
```
Content-Type: application/json
x-goog-api-key: {API_KEY}
```

## Request Body Structure

### Basic Generation (No Reference Images)

```json
{
  "contents": [{
    "parts": [
      { "text": "Your narrative prompt describing the image" }
    ]
  }],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"]
  }
}
```

### Generation with Reference Images (Gemini 3 Pro)

```json
{
  "contents": [{
    "parts": [
      { "text": "Create a professional real estate photo featuring the person in the reference image..." },
      {
        "inline_data": {
          "mime_type": "image/jpeg",
          "data": "base64_encoded_portrait_1"
        }
      },
      {
        "inline_data": {
          "mime_type": "image/jpeg",
          "data": "base64_encoded_portrait_2"
        }
      }
    ]
  }],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"],
    "aspectRatio": "1:1"
  }
}
```

## Reference Image Limits

| Image Type | Max Count | Use Case |
|------------|-----------|----------|
| **Human references** | 5 | Character consistency across posts |
| **Object references** | 6 | Brand assets, logos, property photos |
| **Total combined** | 14 | Complex scenes with people and objects |

## Response Structure

```json
{
  "candidates": [{
    "content": {
      "parts": [
        { "text": "Description of generated image..." },
        {
          "inline_data": {
            "mime_type": "image/png",
            "data": "base64_encoded_generated_image"
          }
        }
      ]
    }
  }]
}
```

## Best Practices

### Prompt Engineering

1. **Use narrative descriptions**, not keyword lists
   - Good: "A friendly Hispanic real estate agent showing a family their new home in a bright, modern kitchen"
   - Bad: "real estate agent, kitchen, family, bright, modern"

2. **Include photography terms** for professional results
   - Lens: "shot with a 35mm lens"
   - Lighting: "soft natural lighting from large windows"
   - Mood: "warm and inviting atmosphere"

3. **Specify aspect ratio upfront** (avoids resizing)
   - Instagram Feed: `1:1` (square)
   - Instagram Stories: `9:16`
   - Portrait: `4:5`

4. **Reference image prompts** should describe the desired scene, not the reference
   - Good: "Create an image of a professional realtor presenting market data..."
   - Bad: "Use this photo to generate..."

### Technical Optimization

| Optimization | Implementation |
|--------------|----------------|
| **Image compression** | Compress portraits to <1MB before base64 encoding |
| **Batch API** | Use for bulk generation (24hr turnaround, lower cost) |
| **Error handling** | Implement retry with exponential backoff |
| **Rate limiting** | Max 10 requests/minute for Pro model |

## n8n Integration

### Converting Binary to Base64

```javascript
// In Code node: Convert portrait binary to base64
const portraits = $input.all();
const referenceImages = portraits.map(p => ({
  inline_data: {
    mime_type: "image/jpeg",
    data: p.binary.data.toString('base64')
  }
}));
return { referenceImages };
```

### Extracting Generated Image

```javascript
// In Code node: Extract base64 image from Gemini response
const response = $json.candidates[0].content.parts;
const imagePart = response.find(p => p.inline_data);

if (imagePart) {
  return {
    imageBase64: imagePart.inline_data.data,
    mimeType: imagePart.inline_data.mime_type,
    textDescription: response.find(p => p.text)?.text || ''
  };
}
throw new Error('No image generated in response');
```

## Error Handling

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 400 | Invalid request | Check prompt format, image size |
| 429 | Rate limit exceeded | Implement backoff, reduce frequency |
| 500 | Server error | Retry with exponential backoff |
| SAFETY | Content policy | Revise prompt, avoid restricted content |

## Cost Estimation

| Scenario | Model | Daily (4 posts) | Monthly |
|----------|-------|-----------------|---------|
| No portraits | Flash | $0.16 | $4.68 |
| All portraits | Pro | $0.24 | $7.20 |

## Portrait Archive URLs

Production portraits served from:
```
https://files.nodeza.cloud/portraits/{filename}
```

Example:
- `https://files.nodeza.cloud/portraits/sully_headshot_1.jpg`
- `https://files.nodeza.cloud/portraits/sully_casual_1.jpg`

> **Note**: Portraits are stored at `/local-files/portraits/` on the VPS and served via the nginx-files container through Traefik.

## Related Resources

- [Google AI Studio](https://aistudio.google.com/) - Test prompts interactively
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs/image-generation) - Official documentation
- n8n workflow ID: `E6ZRlJpDJ64XtDst`
