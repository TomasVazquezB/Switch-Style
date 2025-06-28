namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\Request;

class FirebaseController extends Controller
{
    protected $firestore;

    public function __construct(FirebaseService $firebaseService)
    {
        $this->firestore = $firebaseService->getFirestore();
    }

    public function addUser(Request $request)
    {
        $docRef = $this->firestore->collection('users')->add([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'created_at' => now(),
        ]);

        return response()->json(['id' => $docRef->id()]);
    }

    public function getUsers()
    {
        $documents = $this->firestore->collection('users')->documents();
        $users = [];

        foreach ($documents as $doc) {
            $users[] = $doc->data();
        }

        return response()->json($users);
    }
}