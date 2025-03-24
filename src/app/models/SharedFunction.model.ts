export class SharedFunctionModel {

  extractLabelFromURI(uri: string): string {
    if (!uri) return ''; // Handle empty or null values
    return uri.split('#').pop() || ''; // Get the last part after #
  }
}
