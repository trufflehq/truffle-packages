import SharedModel from './shared.js'

import ActivePowerup from './models/active_powerup.js'
import Alert from './models/alert.js'
import AnalyticsDashboard from './models/analytics_dashboard.js'
import Article from './models/article.js'
import Ban from './models/ban.js'
import Blast from './models/blast.js'
import Cart from './models/cart.js'
import CartItem from './models/cart_item.js'
import Channel from './models/channel.js'
import Chart from './models/chart.js'
import Comment from './models/comment.js'
import Component from './models/component.js'
import ComponentInstance from './models/component_instance.js'
import Chat from './models/chat.js'
import ChatMessage from './models/chat_message.js'
import ClubhouseListener from './models/clubhouse_listener.js'
import Collaborator from './models/collaborator.js'
import Collaboration from './models/collaboration.js'
import Datapoint from './models/datapoint.js'
import Domain from './models/domain.js'
import Donation from './models/donation.js'
import EconomyAction from './models/economy_action.js'
import EconomyTransaction from './models/economy_transaction.js'
import Event from './models/event.js'
import Experiment from './models/experiment.js'
import ExtensionMapping from './models/extension_mapping.js'
import Form from './models/form.js'
import FormQuestionAnswer from './models/form_question_answer.js'
import FormResponse from './models/form_response.js'
import RssFeedItem from './models/rss_feed_item.js'
import Gif from './models/gif.js'
import Link from './models/link.js'
import LegacyOrgUserCounter from './models/legacy_org_user_counter.js'
import LegacyOrgUserCounterType from './models/legacy_org_user_counter_type.js'
import MogulTv from './models/mogul_tv.js'
import OrgUserCounter from './models/org_user_counter.js'
import OrgUserCounterType from './models/org_user_counter_type.js'
import PrintfulItem from './models/printful_item.js'
import Product from './models/product.js'
import ProductVariant from './models/product_variant.js'
import Membership from './models/membership.js'
import MembershipTier from './models/membership_tier.js'
import Package from './models/package.js'
import Page from './models/page.js'
import PhoneNumber from './models/phone_number.js'
import Podcast from './models/podcast.js'
import PodcastEpisode from './models/podcast_episode.js'
import Poll from './models/poll.js'
import Powerup from './models/powerup.js'
import PushSubscription from './models/push_subscription.js'
import Reaction from './models/reaction.js'
import ReadReceipt from './models/read_receipt.js'
import Route from './models/route.js'
import ScheduledBlast from './models/scheduled_blast.js'
import SeasonPass from './models/season_pass.js'
import SeasonPassProgression from './models/season_pass_progression.js'
import TiktokVideo from './models/tiktok_video.js'
import Collection from './models/collection.js'
import Tweet from './models/tweet.js'
import WatchTime from './models/watch_time.js'
import YoutubeVideo from './models/youtube_video.js'

import { API_URL } from './constants.js'

class Model extends SharedModel {
  constructor () {
    super()
    this.activePowerup = new ActivePowerup({ auth: this.auth })
    this.alert = new Alert({ auth: this.auth, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient })
    this.analyticsDashboard = new AnalyticsDashboard({ auth: this.auth })
    this.ban = new Ban({ auth: this.auth })
    this.blast = new Blast({ auth: this.auth })
    this.cart = new Cart({ auth: this.auth })
    this.cartItem = new CartItem({ auth: this.auth })
    this.watchTime = new WatchTime({ auth: this.auth })
    this.channel = new Channel({ auth: this.auth })
    this.chart = new Chart({ auth: this.auth })
    this.chat = new Chat({ auth: this.auth })
    this.chatMessage = new ChatMessage({ auth: this.auth, graphqlClient: this.graphqlClient, proxy: this.proxy })
    this.clubhouseListener = new ClubhouseListener({ auth: this.auth })
    this.collaborator = new Collaborator({ auth: this.auth, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient })
    this.comment = new Comment({ auth: this.auth })
    this.component = new Component({ auth: this.auth, localCache: this.localCache })
    this.componentInstance = new ComponentInstance({ auth: this.auth })
    this.datapoint = new Datapoint({ auth: this.auth })
    this.domain = new Domain({ auth: this.auth, org: this.org })
    this.donation = new Donation({ auth: this.auth })
    this.economyAction = new EconomyAction({ auth: this.auth })
    this.economyTransaction = new EconomyTransaction({ auth: this.auth })
    this.extensionMapping = new ExtensionMapping({ auth: this.auth })
    this.event = new Event({ auth: this.auth })
    this.form = new Form({ auth: this.auth })
    this.formQuestionAnswer = new FormQuestionAnswer({ auth: this.auth })
    this.formResponse = new FormResponse({ auth: this.auth })
    this.experiment = new Experiment()
    this.rssFeedItem = new RssFeedItem({ auth: this.auth })
    this.youtubeVideo = new YoutubeVideo({ auth: this.auth })
    this.gif = new Gif()
    this.link = new Link({ auth: this.auth, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient })
    this.mogulTv = new MogulTv({ auth: this.auth, graphqlClient: this.graphqlClient })
    this.membership = new Membership({ auth: this.auth })
    this.printfulItem = new PrintfulItem({ auth: this.auth })
    this.product = new Product({ auth: this.auth, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient })
    this.productVariant = new ProductVariant({ auth: this.auth, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient })
    this.membershipTier = new MembershipTier({ auth: this.auth, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient })
    this.package = new Package({ auth: this.auth })
    this.page = new Page({ auth: this.auth, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient, org: this.org })
    this.phoneNumber = new PhoneNumber({ auth: this.auth, org: this.org })
    this.podcast = new Podcast({ auth: this.auth })
    this.podcastEpisode = new PodcastEpisode({ auth: this.auth })
    this.article = new Article({ auth: this.auth, podcastEpisode: this.podcastEpisode, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient })
    this.collaboration = new Collaboration({ auth: this.auth, podcastEpisode: this.podcastEpisode })
    this.legacyOrgUserCounter = new LegacyOrgUserCounter({ auth: this.auth })
    this.legacyOrgUserCounterType = new LegacyOrgUserCounterType({ auth: this.auth })
    this.orgUserCounter = new OrgUserCounter({ auth: this.auth })
    this.orgUserCounterType = new OrgUserCounterType({ auth: this.auth })
    this.poll = new Poll({ auth: this.auth })
    this.route = new Route({ auth: this.auth })
    this.reaction = new Reaction({ auth: this.auth, chatMessage: this.chatMessage })
    this.readReceipt = new ReadReceipt({ auth: this.auth })
    this.scheduledBlast = new ScheduledBlast({ auth: this.auth })
    this.seasonPass = new SeasonPass({ auth: this.auth })
    this.seasonPassProgression = new SeasonPassProgression({ auth: this.auth })
    this.tiktokVideo = new TiktokVideo({ auth: this.auth })
    this.tweet = new Tweet({ auth: this.auth })
    this.pushSubscription = new PushSubscription({ auth: this.auth })
    this.collection = new Collection({ auth: this.auth })
    this.powerup = new Powerup({ auth: this.auth })
  }
}

export default new Model()
