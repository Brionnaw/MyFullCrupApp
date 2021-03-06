  namespace app.Services {
  // UserService for users.ts
  export class UserService {
    public RegisterResource;
    public LoginResource;
    public PhotoResource;
    public CurrentUserResource;
    public currentUser;
    public login(user) {
      return this.LoginResource.save(user).$promise;
    }
    public register(user){
      return this.RegisterResource.save(user).$promise;
    }
    public updateUserImage(url){
      return this.PhotoResource.save(url).$promise
    }
    public getCurrentUser(id){
      return this.CurrentUserResource.query({id:id})
    }
    public getUser(){
      return this.currentUser
    }
    public constructor(
      $resource:ng.resource.IResourceService,
      public $state:ng.ui.IStateService
    ){
      this.RegisterResource = $resource('api/users/register');
      this.LoginResource = $resource('api/users/login');
      this.PhotoResource = $resource('api/users/photo');
      this.CurrentUserResource = $resource('api/users/currentUser/:id');
      let token = window.localStorage["token"];
      if(token) {
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        this.currentUser = this.getCurrentUser(payload.id);
        console.log('logged in') // redirect user to login if token is expired.
      } else {
        this.$state.go('Login')
      }
    }
  }
  // Feed service for post.ts
  export class FeedService {
    public FeedResource;
    public PostResource;
    public CompanyResource;
    public myPosts;

    public createPost(postData) {
      console.log(postData)
      let post = {
        name:postData.name,
        domain:postData.domain,
        id: postData.id,
        author:postData.username,
        interviewType:postData.interviewType,
        positionTitle:postData.position,
        text: postData.text
      }
      return this.FeedResource.save(postData).$promise
    }
    public getAllPosts(companyName){
      return this.PostResource.query({name:companyName});
    }
    public deletePost(id) {
      return this.FeedResource.remove({id: id}).$promise
    }
    public getAllProfilePosts(username){
      return this.FeedResource.query({id:username});
    }
    public checkCompanyPosts(companyName){
      let collection = this.CompanyResource.query({name: companyName.name});
      this.savePosts(collection, companyName.name)
    }
    public savePosts(posts, company){
      console.log(company)
      if(posts.message === 'false'){
        this.$state.go('Feed',{info:['false', company]})
      } else {
        this.myPosts = posts;
        this.$state.go('Feed', {info:['true', company]})
      }
    }
    constructor(
      private $resource: ng.resource.IResourceService,
      public $state: ng.ui.IStateService
    ){
      this.FeedResource = $resource('api/posts/feed/:id');
      this.PostResource = $resource('api/posts/company/:name');
      this.CompanyResource = $resource('api/reviews/:name');
    }
  }
  //Company.html
  export class CompanyService {
    public CompanyResource;
    public GlassdoorResource;
    public researchCompany(companyInfo){
      let company = {
        company: companyInfo.company,
        domain: companyInfo.domain,
        posts:companyInfo.posts
      }
      return this.CompanyResource.save(companyInfo).$promise
    }
    public glassdoor(glassdoorInfo){
      return this.GlassdoorResource.save(glassdoorInfo).$promise
    }
    constructor(
      private $resource: ng.resource.IResourceService
    ){
      this.CompanyResource = $resource('api/company');
      this.GlassdoorResource = $resource('api/company/glassdoor');
    }
  }
  angular.module('app').service('userService', UserService);
  angular.module('app').service('feedService', FeedService);
  angular.module('app').service('companyService', CompanyService);
}
