import { Component, ReactNode } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/lib/theme';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('App crashed:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <Text style={styles.title}>مشکلی پیش آمد</Text>
          <Text style={styles.subtitle}>متن زیر را اسکرین‌شات بگیرید و ارسال کنید:</Text>
          <View style={styles.box}>
            <Text style={styles.errorText} selectable>
              {this.state.error.name}: {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </Text>
          </View>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.neutral[950] },
  content: { padding: Spacing.lg, paddingTop: 60 },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.error[600],
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[400],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  box: {
    backgroundColor: Colors.neutral[850],
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: Colors.neutral[200],
    textAlign: 'left',
  },
});
