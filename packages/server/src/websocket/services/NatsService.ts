import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, JetStreamManager, NatsConnection, Subscription } from 'nats';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private client: NatsConnection;
  private subscriptions: Map<string, Subscription> = new Map();
  private jetStreamManager: JetStreamManager;

  async onModuleInit() {
    this.client = await connect({ servers: 'nats://localhost:4222' }); // Adjust the server URL as needed
    console.log('Connected to NATS');
    this.jetStreamManager = await this.client.jetstreamManager();
  }

  async subscribeToTopic(topic: string, handler: (message: any) => void): Promise<void> {
    const subscription = this.client.subscribe(topic);
    this.subscriptions.set(topic, subscription);

    // Consume messages
    (async () => {
      for await (const message of subscription) {
        const decodedMessage = message.data.toString();
        handler(decodedMessage);
      }
    })().catch((err) => console.error(`Error processing messages for ${topic}:`, err));

    console.log(`Subscribed to topic: ${topic}`);
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    const subscription = this.subscriptions.get(topic);

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } else {
      console.warn(`No subscription found for topic: ${topic}`);
    }
  }

  getJetStreamManager() {
    return this.jetStreamManager;
  }

  getJetStream() {
    return this.client.jetstream();
  }

  async onModuleDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach((sub, topic) => {
      sub.unsubscribe();
      console.log(`Cleaned up subscription for topic: ${topic}`);
    });

    // Close NATS client
    await this.client.close();
    console.log('Disconnected from NATS');
  }
}
